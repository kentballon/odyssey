---
title: "I thought 512 was large"
number: 13
author: "Kent Ballon"
state: "published"
date: 2022-03-21
tags: ["Postgresql", "Database", "Migrations", "API"]
---

## Summary

While importing a project from remote object storage on a GitLab
instance, we ran into a `PG::CheckViolation` error whenever the request
used a pre-signed URL. The root cause turned out to be a hard `512`
character check constraint on the `remote_import_url` column, which
pre-signed S3 URLs blow past without even trying. The fix was a small,
zero-downtime migration that raised the limit to `2048`.

<img src="https://kentballon.github.io/odyssey/images/512.png" alt="Bar Joke" style="width:100%; height:auto;">

## Context

The [Import a project from a remote archive](httphttps://docs.gitlab.com/api/project_import_export/#import-a-project-from-a-remote-archive)
feature lets you kick off a project import via the API by pointing GitLab
at a URL instead of uploading a file directly:

```
curl --request POST \
  --header "PRIVATE-TOKEN: <your_access_token>" \
  --header "Content-Type: application/json" \
  --url "https://gitlab.example.com/api/v4/projects/remote-import" \
  --data '{"url":"https://url_length_exceed_512","path":"remote-project"}'
```

That `url` value gets written to `remote_import_url` on the
`import_export_uploads` table, and that column had a check constraint
capping it at `512` characters. Reasonable enough on paper, until you
remember how [pre-signed URLs](https://stackoverflow.com/questions/70975517/aws-s3-signed-url-length-max)
are built.

## Details

### Symptom

While testing the remote import endpoint against a GitLab instance, a
request failed outright with:

```
{"message":"PG::CheckViolation: ERROR: new row for relation \"import_export_uploads\" violates check constraint \"check_58f0d37481\"\nDETAIL: Failing row contains (1398482, 2022-02-08 08:24:06.033916+00, 33508437, null, null, null, <generated pre-signed url>...).\n"}
```

This was a database constraint rejecting the row outright before the import could even be attempted.

### Plan

- Reproduce the failure locally against a GDK instance using a URL long enough to trip the constraint.
- Confirm the `512` limit was in fact the blocker, not something upstream in the request handling.
- Figure out why a "reasonable" URL length limit was getting exceeded in the first place.
- If the limit genuinely needed raising, do it as a proper zero-downtime constraint change rather than a blind schema edit.

### Findings

#### Pre-signed URLs are longer than they look

Pre-signed URLs packs a lot into the URL string: the access key ID,
signing date, credential scope, signed headers list, expiry, and the
signature itself, all as query parameters on top of the object path. A
perfectly normal pre-signed URL for a single object can sail past 512
characters without anything unusual going on. The constraint wasn't
guarding against malformed input, it was just too conservative for how
the URLs are actually generated.

I confirmed this locally by reproducing the exact failure:
 
```
curl --request POST \
  --header "PRIVATE-TOKEN: <REDACTED>" \
  --header "Content-Type: application/json" \
  --url "http://localhost:3000/api/v4/projects/remote-import" \
  --data '{"url":"https://<REDACTED>.s3.amazonaws.com/test.txt.txt?123123ABCDEF...","path":"remote-project"}'
{"message":"PG::CheckViolation: ERROR:  new row for relation \"import_export_uploads\" violates check constraint \"check_58f0d37481\"\n..."}
```

#### Raising the limit without locking the table

Once the fix was clearly "raise the character limit," the more
interesting part was doing it without a table-locking migration on a
column that gets written to on every remote import. The migration drops
the old constraint, adds the new one as `NOT VALID` (so it applies to new
writes immediately without scanning existing rows), then validates it
separately:

<img src="https://encrypted-tbn1.gstatic.com/images?q=tbn:ANd9GcST9yNnCr6Y6_G_V7I7iAe8gkqEbFfixvXyTJPlOdFIp9dhFjYz" alt="Migration" style="width:100%; height:auto;">

```
== 20220321025720 AlterConstraintRemoteImportUrl: migrating ===================
-- execute("ALTER TABLE import_export_uploads\nDROP CONSTRAINT IF EXISTS check_58f0d37481\n")
   -> 0.0018s
-- execute("ALTER TABLE import_export_uploads\nADD CONSTRAINT check_58f0d37481\nCHECK ( char_length(remote_import_url) <= 2048 )\nNOT VALID;\n")
   -> 0.0033s
-- execute("SET statement_timeout TO 0")
   -> 0.0007s
-- execute("ALTER TABLE import_export_uploads VALIDATE CONSTRAINT check_58f0d37481;")
   -> 0.0014s
-- execute("RESET statement_timeout")
   -> 0.0005s
== 20220321025720 AlterConstraintRemoteImportUrl: migrated (0.0245s) ==========
```

`2048` was picked as a generous but sane ceiling, comfortably above what
a pre-signed URL needs while still guarding against something absurd
ending up in that column.

#### Resolution

After running the migration locally, the exact same request that failed
before went through cleanly:

```
curl --request POST \
  --header "PRIVATE-TOKEN: <REDACTED>" \
  --header "Content-Type: application/json" \
  --url "http://localhost:3000/api/v4/projects/remote-import" \
  --data '{"url":"https://<REDACTED>.s3.amazonaws.com/test.txt.txt?123123ABCDEF...","path":"remote-project"}'
{"id":21,"description":null,"name":"remote-project","name_with_namespace":"gdk_user_01 / remote-project","path":"remote-project","path_with_namespace":"gdk_user_01/remote-project","created_at":"2022-02-18T02:27:47.052Z","import_status":"scheduled","import_type":"gitlab_project","correlation_id":"01FW5AG7YWZQT9CMRDZTWXR741","failed_relations":[],"import_error":null,"stats":null}
```

I opened an issue [#353045](https://gitlab.com/gitlab-org/gitlab/-/work_items/353045) and followed with the fix under [!80885](https://gitlab.com/gitlab-org/gitlab/-/merge_requests/80885).
We were able to merge this without any hiccups as no application code depended on the old limit.

Sometimes the whole investigation really is just: read the error
message, find the number it's complaining about, and ask why that
number was chosen in the first place.

## References

- [#353045 — Import file from object storage fails if URL length exceeds 512](https://gitlab.com/gitlab-org/gitlab/-/work_items/353045)
- [!80885 — Increase remote import URL character length limit from 512 to 2048](https://gitlab.com/gitlab-org/gitlab/-/merge_requests/80885)
- [Import a file from a remote object storage](https://docs.gitlab.com/ee/api/project_import_export.html#import-a-file-from-a-remote-object-storage)
- [SigV4 query string authentication](https://docs.aws.amazon.com/AmazonS3/latest/API/sigv4-query-string-auth.html)