---
title: "Flipping through Yellow Pages"
number: 10
author: "Kent Ballon"
state: "published"
date: 2025-09-16
tags: ["internal tooling","documentation"]
---

## Summary

I created an internal tool the team can use to search features, groups, members, 
documentation and product category. 

<img src="https://gitlab.com/gitlab-com/support/toolbox/engineering-directory/-/raw/main/media/demo_new.gif" alt="Engineering Directory" style="width:100%; height:auto;">

## Context

While the industry in general have different thoughts around the use of AI,
I'm fairly open to adopting technologies and leveraging them
for the right problem. At the end of the day they are still tools for humans
to use. The Engineering Directory was my first stab at 
"vibe coding" when the cool kids were trying it out.

## Details

This project streamlines the process of identifying appropriate engineering 
resources for GitLab [features](https://gitlab.com/gitlab-com/www-gitlab-com/blob/master/data/features.yml) and escalations. 
We can quickly locate the [teams](https://gitlab.com/gitlab-com/www-gitlab-com/blob/master/data/stages.yml) 
and [individuals](https://gitlab.com/gitlab-com/www-gitlab-com/-/tree/master/data/team_members/person) 
responsible for specific GitLab features. This provides a more accessible 
alternative to examining documentation source code metadata directly. 
Engineers can also use this to sort out [Product Category](https://gitlab.com/gitlab-com/www-gitlab-com/blob/master/data/categories.yml) 
mappings while working on their cases. 

For on-call engineers, this gives them the ability to 
identify the correct groups and communication channels when triggering 
developer escalations during customer emergencies.

In this case I opted to create something deterministic instead of relying on "agents" to do the work.
I achieved this by stitching all publicly available information about the team and consolidating
an index mapped to all relevant values.

While I know there might be some negative connotations depending on which seat you reside in the industry, 
I cannot discount the fact that the output has proved useful not only to the support team, 
but even to our developers, CSMs, and marketing team. 
It's a very trivial tool which just surfaces the team and developers responsible for any feature in GitLab.

## References

- [Features](https://gitlab.com/gitlab-com/www-gitlab-com/blob/master/data/features.yml)
- [Groups](https://gitlab.com/gitlab-com/www-gitlab-com/blob/master/data/stages.yml)
- [Team members](https://gitlab.com/gitlab-com/www-gitlab-com/-/tree/master/data/team_members/person)
- [Product Categories](https://gitlab.com/gitlab-com/www-gitlab-com/blob/master/data/categories.yml)
