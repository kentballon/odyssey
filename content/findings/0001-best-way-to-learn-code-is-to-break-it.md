---
title: "Best way to learn code is to break it"
number: 1
author: "Kent Ballon"
state: "published"
date: 2022-03-05
tags: ["authentication", "auditor"]
---

## Summary

Early in my GitLab years, I proactively contributed to the codebase
by resolving feature requests and bugs in the
[Auditor Role](https://docs.gitlab.com/administration/auditor_users/)
functionality. Working with other engineers and pairing through several
of the fixes, I implemented and merged multiple changes that closed gaps
in this feature.

## Context

The Auditor Role is meant to give a user read-only visibility across an 
instance for compliance purposes, without granting the ability to make 
changes the way an administrator account can. In practice, several corners
of the codebase hadn't fully caught up to that intent: some views and 
permission checks still treated auditor users inconsistently, 
which meant the role didn't always behave the way compliance-focused 
customers expected.

## Details

I picked up a series of related issues and worked through them individually, 
several with pairing sessions to validate the right fix and get it reviewed 
efficiently:

- gitlab.com/gitlab-org/gitlab/-/issues/357328
- gitlab.com/gitlab-org/gitlab/-/issues/355528
- gitlab.com/gitlab-org/gitlab/-/issues/355500
- gitlab.com/gitlab-org/gitlab/-/issues/354579
- gitlab.com/gitlab-org/gitlab/-/issues/354577
- gitlab.com/gitlab-org/gitlab/-/issues/367520
- gitlab.com/gitlab-org/gitlab/-/issues/368089

Each of these addressed a specific behavioral gap between what an auditor
account could see or do versus what it was supposed to be scoped to. 
Taken together, they moved the feature closer to a consistent, 
predictable permission boundary.

These fixes directly improved GitLab's compliance capabilities by closing 
functionality gaps between regular and administrator accounts.
For organizations that need strict audit controls, this meant proper
separation of duties, auditors get comprehensive visibility without the 
ability to alter the system, which is the whole point of the role.

The work shipped as part of [GitLab 15.5](about.gitlab.com/releases/2022/10/22/gitlab-15-5-released).

## References

- [Auditor users documentation](https://docs.gitlab.com/administration/auditor_users/)
- [GitLab 15.5 release post](about.gitlab.com/releases/2022/10/22/gitlab-15-5-released)
- gitlab.com/gitlab-org/gitlab/-/issues/357328
- gitlab.com/gitlab-org/gitlab/-/issues/355528
- gitlab.com/gitlab-org/gitlab/-/issues/355500
- gitlab.com/gitlab-org/gitlab/-/issues/354579
- gitlab.com/gitlab-org/gitlab/-/issues/354577
- gitlab.com/gitlab-org/gitlab/-/issues/367520
- gitlab.com/gitlab-org/gitlab/-/issues/368089
