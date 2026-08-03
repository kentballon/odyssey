---
title: "Houston, we have a problem"
number: 9
author: "Kent Ballon"
state: "published"
date: 2026-03-07
tags: ["authorization","authentication","documentation"]
---

## Summary

I've been lucky enough (again) to get pulled into a security escalation where
a GitLab instance's Identity Provider (IdP) was compromised. For compliance 
(and likely legal) concerns, we had to a figure out a way to purge all active 
sessions from the running instance without touching the IdP.

![Houston, we have a problem.](https://gifrific.com/wp-content/uploads/2014/01/Apollo-13-Houston-We-Have-a-Problem-Tom-Hanks.gif "Houston, we have a problem.")

## Context

Prior to this [step](https://docs.gitlab.com/user/profile/active_sessions/#revoke-all-sessions-for-all-users-of-a-group)
being published there was no easy to revoke all active sessions for a group. 
This was uncharted territory and needed validation for a production environment.

## Details

A customer needed help in managing the authenticated sessions of their users. They needed urgent assistance in forcing everybody out
while keeping the trail of events.

This was an unprecedented scenario at the time so I've worked with our 
[SIRT](https://handbook.gitlab.com/handbook/security/security-operations/sirt/) and 
[SRE](https://handbook.gitlab.com/job-description-library/engineering/infrastructure/site-reliability-engineer/) 
team to formulate a path forward until this 
[feature request](https://gitlab.com/gitlab-org/gitlab/-/work_items/385091) is implemented.

This lead to our workaround under this Merge Request (MR).

- [Add steps to revoke active sessions for all members of a group](https://gitlab.com/gitlab-org/gitlab/-/merge_requests/226425)

One thing we had to keep in mind was to ensure all direct and 
inherited members from the top level group and subgroups were all accounted for.

```
   # Direct and inherited members of the top-level group
   user_ids.merge(group.members_with_parents.pluck(:user_id))

   # Members invited via group shares into the top-level group
   group.shared_with_group_links.each do |link|
      user_ids.merge(link.shared_with_group.members_with_parents.pluck(:user_id))
   end
```

Using this approach, we were able to safely mitigate their emergency and secure their Gitlab group.

## References

- [Revoke all sessions for all users of a group](https://docs.gitlab.com/user/profile/active_sessions/#revoke-all-sessions-for-all-users-of-a-group)
- [Add steps to revoke active sessions for all members of a group](https://gitlab.com/gitlab-org/gitlab/-/merge_requests/226425)
