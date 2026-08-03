---
title: "Quick, write it down!"
number: 3
author: "Kent Ballon"
state: "published"
date: 2024-11-07
tags: ["knowledge","documentation"]
---

## Summary

As part of formalizing GitLab's [Knowledge Base](https://gitlab.com/gitlab-com/support/support-pages/-/tree/master/kb-documentation), 
I joined the team that spearheaded this initiative and helped write articles for 
emerging customer issues that were not yet covered by our existing documentation.

## Context

While our troubleshooting documentations covers some of the older gotchas, 
we needed a timely way to deliver critical content and allow our customers
to self serve some of these issues.

## Details

Knowledge Base articles only help if they exist before the second or third customer 
hits the same issue. 

One notable case was an upstream curl 
bug [curl/curl#15496](https://github.com/curl/curl/issues/15496)
that triggered a couple of customer emergencies before we had anything written up to 
handle it. I published a [KB article](https://support.gitlab.com/hc/en-us/articles/16782319936540-Encountering-netrc-parse-error-while-running-CI-CD-pipeline) 
so the rest of the team could deflect and resolve further occurrences without starting 
from scratch each time. The curl bug was a good example of the gap: it wasn't something 
our existing documentation anticipated, so the first couple of instances turned into emergencies 
that had to be worked reactively. Writing it up wasn't just about the current tickets, 
it was about making sure the next engineer who saw the same symptom had somewhere to start.

Formalized KB coverage let customers self-serve on issues that would otherwise have
needed a support ticket, which reduced ticket volume on already-known problems and 
freed up engineer time for the issues that actually needed hands-on investigation. 
For emergency-prone cases like the curl bug, having the article in place meant the 
second and third occurrence were routine instead of another fire drill.

## References

- [git fetch fails .netrc parse with libcurl 8.11.0](https://github.com/curl/curl/issues/15496)
- [Encountering .netrc parse error while running CI/CD pipeline](https://support.gitlab.com/hc/en-us/articles/16782319936540-Encountering-netrc-parse-error-while-running-CI-CD-pipeline)
- [Added netrc parse error workaround](https://gitlab.com/gitlab-com/support/support-pages/-/merge_requests/76/diffs)
