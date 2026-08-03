---
title: "Is it stupid if it works?"
number: 4
author: "Kent Ballon"
state: "draft"
date: 2025-09-25
tags: ["emergency","integration","slack", "pagerduty"]
---

## Summary

We have been mostly using [Pagerduty](https://gitlab.com/gitlab-com/content-sites/handbook/blob/main/content/handbook/support/on-call.md)
for our on-call rotations. This has worked for a while but as the volume of emergencies
grew, we needed an alternative way for handover during time sensitive scenarios.

## Context

Historically we relied on the published [Pagerduty schedules](https://gitlab.com/gitlab-com/content-sites/handbook/blob/main/content/handbook/support/on-call.md#schedule-and-escalation-policy) for each region. We already
have an existing Slack handle `@ceoc` that can ping the current on call engineer. I raised this idea
in our RFC (Request for Comments) and extended further to allow some "predictive capability"

- [RFC: Implement @ceoc-next handle for CEOC handover workflow](https://gitlab.com/gitlab-com/support/support-team-meta/-/work_items/7134)

## Details

I've worked with our SRE's and we created a new Slack handle `@ceoc-next` that would
automatically tag the next on-call engineer regardless of the schedule or 
region they are in. 

```
[EMEA G1]                                             # next = AMER G1
[EMEA G2]                                             # next = AMER G1
          [AMER G1]                                   # next = AMER G2 (until start of G2, then same as G2)
            [AMER G2]                                 # next = AMER G3 (until start of G3, then same as G3)
              [AMER G3]                               # next = APAC G1
                        [APAC G1]                     # next = APAC G2
                                  [APAC G2]           # next = EMEA G1 and G2
                                            [EMEA G1]
                                            [EMEA G2]
```

We implemented this idea under this Merge Request:

- [feat: update-oncall-usergroups: implement --next-schedules, which selects ingress on-call](https://gitlab.com/gitlab-com/support/support-team-meta/-/work_items/7134)

We've evaluated this for a couple of weeks and found it successful based on our trial results.

- [CEOC Workflow: @ceoc-next Slack handle trial](https://gitlab.com/gitlab-com/support/support-team-meta/-/work_items/7197)

This allows eliminates manual lookup of schedules for handovers. It gives engineers easier 
path for coordination during overlapping/multiple emergencies. It also opened up earlier engagement 
for better handovers instead of waiting for the current on-call enginers time to run up.

With the increased adoption, we later implemented this to other on-call rotations 
as well and has proven quite useful. We did receive pushback for the
manager's handles as it was deemed a bit noisy for a few of them (can't win them all).

- [RFC: Implement @cmoc-next, @dedicated-cmoc-next, and @support-manager-oncall-next handles](https://gitlab.com/gitlab-com/support/support-team-meta/-/work_items/7212)
- [Slack handle trial: @cmoc-next, @dedicated-cmoc-next, and @support-manager-oncall-next](https://gitlab.com/gitlab-com/support/support-team-meta/-/work_items/7228)


## References

- [Pagerduty](https://gitlab.com/gitlab-com/content-sites/handbook/blob/main/content/handbook/support/on-call.md)
- [RFC: Implement @ceoc-next handle for CEOC handover workflow](https://gitlab.com/gitlab-com/support/support-team-meta/-/work_items/7134)
- [feat: update-oncall-usergroups: implement --next-schedules, which selects ingress on-call](https://gitlab.com/gitlab-com/support/support-team-meta/-/work_items/7134)
- [CEOC Workflow: @ceoc-next Slack handle trial](https://gitlab.com/gitlab-com/support/support-team-meta/-/work_items/7197)
- [RFC: Implement @cmoc-next, @dedicated-cmoc-next, and @support-manager-oncall-next handles](https://gitlab.com/gitlab-com/support/support-team-meta/-/work_items/7212)
- [Slack handle trial: @cmoc-next, @dedicated-cmoc-next, and @support-manager-oncall-next](https://gitlab.com/gitlab-com/support/support-team-meta/-/work_items/7228)
