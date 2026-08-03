---
title: "Best way to learn code is to break it"
number: 1
author: "Kent Ballon"
state: "published"
date: 2022-03-05
tags: ["authentication", "auditor"]
---

## Summary

I firmly believe that getting dirty and reading code is the best way
to learn about an application. I picked feature requests and bugs in the
[Auditor Role](https://docs.gitlab.com/administration/auditor_users/)
functionality and proactively contributed to the codebase as a way of learning. 
Working with other engineers and pairing through several
of the fixes, I implemented and merged multiple changes that closed gaps
in this feature.

## Context

The Auditor Role is meant to give a user read-only visibility across an 
instance for compliance purposes, without granting the ability to make 
changes the way an administrator account can. In practice, several corners
of the [codebase](https://gitlab.com/groups/gitlab-org/-/work_items/7469) 
hadn't fully caught up to that intent: some views and permission checks 
still treated auditor users inconsistently, which meant the role didn't 
always behave the way compliance-focused customers expected.

## Details

I sifted through a series of related issues and worked through them, 
holding pairing sessions with other engineers to validate the right fix and 
get it reviewed accordingly:

- [Auditors cannot see group CI/CD (Runners)](https://gitlab.com/gitlab-org/gitlab/-/issues/357328)
- [Auditor cannot view CI/CD analytics](https://gitlab.com/gitlab-org/gitlab/-/issues/355528)
- [Auditor cannot see group compliance reports](https://gitlab.com/gitlab-org/gitlab/-/issues/355500)
- [Auditor cannot view Container Registry at group level](https://gitlab.com/gitlab-org/gitlab/-/issues/354579)
- [Auditor cannot see group wiki](https://gitlab.com/gitlab-org/gitlab/-/issues/354577)
- [Follow-up from "Add auditor access for group runners" (Hide register a runner button)](https://gitlab.com/gitlab-org/gitlab/-/issues/367520)
- [[Feature flag] Enable Auditor Access to Group Runners](https://gitlab.com/gitlab-org/gitlab/-/issues/368089)

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
- [Ensure Auditor permissions in UI follow docs](https://gitlab.com/groups/gitlab-org/-/work_items/7469)
- [GitLab 15.5 release post](about.gitlab.com/releases/2022/10/22/gitlab-15-5-released)
- [Auditors cannot see group CI/CD (Runners)](https://gitlab.com/gitlab-org/gitlab/-/issues/357328)
- [Auditor cannot view CI/CD analytics](https://gitlab.com/gitlab-org/gitlab/-/issues/355528)
- [Auditor cannot see group compliance reports](https://gitlab.com/gitlab-org/gitlab/-/issues/355500)
- [Auditor cannot view Container Registry at group level](https://gitlab.com/gitlab-org/gitlab/-/issues/354579)
- [Auditor cannot see group wiki](https://gitlab.com/gitlab-org/gitlab/-/issues/354577)
- [Follow-up from "Add auditor access for group runners" (Hide register a runner button)](https://gitlab.com/gitlab-org/gitlab/-/issues/367520)
- [[Feature flag] Enable Auditor Access to Group Runners](https://gitlab.com/gitlab-org/gitlab/-/issues/368089)