---
title: "A QA tester walks into a bar and saw it was empty"
number: 12
author: "Kent Ballon"
state: "published"
date: 2025-06-11
tags: ["postgresql","database","migrations"]
---

## Summary

Using the investigation from [505982](https://gitlab.com/gitlab-org/gitlab/-/work_items/505982) as a useful precedent, we formulated a workaround in [548685](https://gitlab.com/gitlab-org/gitlab/-/work_items/548685#workaround) that was blocking the upgrade of large GitLab deployments. We also published a [KB article](https://support.gitlab.com/hc/en-us/articles/20536941902876-PG-CheckViolation-ERROR-check-constraint-check-4fab85ecdc-of-relation-ci-build-needs-is-violated-by-some-row) and delivered a backport fix within the month.

<img src="https://en.wikipedia.org/wiki/Bar_joke#/media/File:A_priest,_a_rabbi,_a_minister_and_a_duck_walk_into_a_bar.jpg" alt="Bar Joke" style="width:100%; height:auto;">

## Context

On May 21, 2025, GitLab released `18.0.1` along with the corresponding `17.11.3` and `17.10.7` patch releases. The release included important bug and security fixes, and self-managed installations were encouraged to upgrade. See the [18.0.1 patch release announcement](https://docs.gitlab.com/releases/patches/patch-release-gitlab-18-0-1-released/).

About a week later, larger GitLab instances began upgrading to 18.0.1 and some of them could not complete the database migrations.

## Details

The migration failed with the following error:

```
PG::CheckViolation: ERROR: check constraint "check_4fab85ecdc" of relation "ci_build_needs" is violated by some row
```

The immediate impact was that the upgrade could not proceed. This was especially difficult for larger installations because the migration failure interrupted an upgrade that was already in progress and required database-level investigation before the instance could continue.

### Plan

I approached the issue in a few steps:

- Understand which data was violating the new constraint.
- Determine whether the problem was limited to a specific upgrade path.
- Reproduce the behavior under realistic conditions where possible.
- Create the smallest practical workaround that would allow the migration to continue.
- Publish the workaround so Support could provide consistent guidance.
- Work with the engineering team toward a proper backport fix.

Although I am not a database engineer, I am comfortable diving into these problems. I may not know every part of PostgreSQL at first but I can begin with the failing constraint, inspect the affected rows, understand the relationship between the tables, and validate the proposed change carefully.

### Findings

The failed constraint was related to the `project_id` column in the `ci_build_needs` table. Some environments had rows where `project_id` was `NULL`, even though the related build record contained the project information needed to populate it.

<img src="https://www.reddit.com/media?url=https%3A%2F%2Fpreview.redd.it%2Fshoutout-to-all-the-null-pointers-just-doing-their-jobs-v0-ic1ic8jjkys71.png%3Fwidth%3D1080%26crop%3Dsmart%26auto%3Dwebp%26s%3Dfb54b5362f7348406a80160e56c847892b4560f1" alt="Bar Joke" style="width:100%; height:auto;">

The first step was to confirm whether any rows violated the constraint:

```
SELECT count(*)
FROM ci_build_needs
WHERE project_id IS NULL;

SELECT *
FROM ci_build_needs
WHERE project_id IS NULL
LIMIT 1;
```

If affected rows were found, the project ID could be backfilled from the related `ci_builds` record:

```
UPDATE ci_build_needs
SET project_id = ci_builds.project_id
FROM ci_builds
WHERE ci_build_needs.build_id = ci_builds.id
  AND ci_build_needs.project_id IS NULL;
```

After the update, the data needed to be validated again:

```
SELECT count(*)
FROM ci_build_needs
WHERE project_id IS NULL;
```

Once the query returned no affected rows, the migration could be attempted again:

```
gitlab-rake db:migrate
```

This was a simple workaround, but it still required care because it modified database records directly. The procedure was intended for qualified administrators working with the appropriate change controls and support guidance, not for folks to run without understanding the data relationship.

### Turning the investigation into support guidance

[Ben's](https://gitlab.com/bprescott_) work item [505982](https://gitlab.com/gitlab-org/gitlab/-/work_items/505982) was a useful example of how to turn a complex database problem into a structured procedure for Support. I followed the same general approach here:

- Start with a clear warning and scope.
- Explain what the error means.
- Provide a query to confirm the affected condition.
- Provide the corrective query.
- Include a validation step.
- Explain how to retry the migration.
- Document the underlying cause and related engineering work.

This made the workaround easier to review, easier to communicate, and less likely to be applied blindly.

### Increasing visibility with a KB article

Because the issue affected the upgrade path for larger self-managed instances, keeping the workaround only in an engineering work item was not enough. We published the [KB article](https://support.gitlab.com/hc/en-us/articles/20536941902876-PG-CheckViolation-ERROR-check-constraint-check-4fab85ecdc-of-relation-ci-build-needs-is-violated-by-some-row) so engineers could find the guidance quickly when customers reported the migration error.

The KB included the affected version, the exact error message, the validation queries, the backfill query, and the migration retry command. This also gave us a consistent reference to share internally and with affected customers.

### Results

The workaround allowed affected instances to correct the inconsistent rows and continue the migration. Publishing the KB increased visibility and helped the tteam respond consistently while the engineering fix was being prepared.

Engineering was then able to deliver a backport fix within the month, reducing the need for customers to perform the manual workaround on patched versions.

## References

- [KB article](https://support.gitlab.com/hc/en-us/articles/20536941902876-PG-CheckViolation-ERROR-check-constraint-check-4fab85ecdc-of-relation-ci-build-needs-is-violated-by-some-row)
- [505982](https://gitlab.com/gitlab-org/gitlab/-/work_items/505982)
- [548685](https://gitlab.com/gitlab-org/gitlab/-/work_items/548685#workaround)
- [18.0.1 patch release announcement](https://docs.gitlab.com/releases/patches/patch-release-gitlab-18-0-1-released/)