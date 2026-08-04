---
title: "Flipping through Yellow Pages"
number: 10
author: "Kent Ballon"
state: "published"
date: 2025-09-16
tags: ["internal tooling","documentation"]
---

## Summary

I created a directory the team can use to search features, groups, members, 
documentation and product category. 

- [Engineering Directory](https://gitlab-com.gitlab.io/support/toolbox/engineering-directory/)


<img src="https://gitlab.com/gitlab-com/support/toolbox/engineering-directory/-/raw/main/media/themes_new.png" alt="Engineering Directory" style="width:100%; height:auto;">

## Context

The [Engineering Directory](https://gitlab-com.gitlab.io/support/toolbox/engineering-directory/) was my first stab at 
"vibe coding" when the cool kids were trying it out.

## Details

Historically you can reach out to the right resources by trying the following.

- You can inspect the documentation page tied to a feature and look at the metadata. Here's an example for [SAML SSO for GitLab Self-Managed](https://gitlab.com/gitlab-org/gitlab/-/blob/master/doc/integration/saml.md).

```
stage: Software Supply Chain Security
group: Authentication
info: To determine the technical writer assigned to the Stage/Group associated with this page, see <https://handbook.gitlab.com/handbook/product/ux/technical-writing/#assignments>
title: SAML SSO for GitLab Self-Managed
description: Configure enterprise authentication with SAML integration for single sign-on access.
```

- You can then cross reference that information against the [Features by Group](https://handbook.gitlab.com/handbook/product/categories/features/).

- Or you can always ask in the public channels and wait for people to point you in the right direction.

This project streamlines the process of identifying appropriate engineering 
resources handling GitLab [features](https://gitlab.com/gitlab-com/www-gitlab-com/blob/master/data/features.yml) by mapping each entry to the corresponding [groups](https://gitlab.com/gitlab-com/www-gitlab-com/blob/master/data/stages.yml) 
and [individuals](https://gitlab.com/gitlab-com/www-gitlab-com/-/tree/master/data/team_members/person). Engineers can also use this to sort out [Product Category](https://gitlab.com/gitlab-com/www-gitlab-com/blob/master/data/categories.yml) mappings while working on their cases. For on-call folks, this gives them the ability to quickly identify the correct groups and communication channels when triggering developer escalations during customer emergencies.

This provides a more natural approach to finding the right person to talk to, which in my experience happens many times throughout the day. Here is what the experience feels like.

<img src="https://gitlab.com/gitlab-com/support/toolbox/engineering-directory/-/raw/main/media/demo_new.gif" alt="Engineering Directory" style="width:100%; height:auto;">

I approached this by using LLMs to generate something deterministic instead of relying on "agents" to do the work. I still take pride and enjoy solving engineering problems using my outdated CPU resources. I achieved this by correlating publicly available information about the team and consolidating an index mapped to all relevant values.

```
    print("Fetching GitLab sections data...")
    sections_data = fetch_sections_data()
    
    print("Fetching GitLab stages data...")
    stages_data = fetch_stages_data()
    
    print("Fetching GitLab features data...")
    features_data = fetch_features_data()
    
    print("Fetching GitLab categories data...")
    categories_data = fetch_categories_data()
    
    print("Loading GitLab documentation metadata...")
    doc_entries = load_gitlab_docs_metadata()
    
    print("Creating group mappings...")
    group_mappings = create_group_mappings(stages_data, sections_data, categories_data)
    
    print("Fetching GitLab team member data...")
    team_members = fetch_team_data()
    print(f"Found {len(team_members)} total team members")
    
    print("Filtering Engineering division members...")
    engineering_members = filter_engineering_members(team_members)
    print(f"Found {len(engineering_members)} Engineering members")
    
    print("Enhancing members with role information...")
    enhanced_members = enhance_members_with_roles(engineering_members, group_mappings)
    
    print("Grouping by unified groups...")
    grouped_members = group_by_unified_groups(enhanced_members, group_mappings)
    
    print("Creating feature-category mappings...")
    feature_mappings = create_feature_category_mappings(features_data, group_mappings, doc_entries)
```

While I know there might be some negative connotations depending on which seat you reside in the industry, 
I cannot discount the fact that the output has proved to be useful not only for our support team, but for our developers, CSMs, and marketing team. At the end of the day they are still tools for humans to use. 

It just happend that this one was used to flip through the yellow pages.

## References

- [Engineering Directory](https://gitlab-com.gitlab.io/support/toolbox/engineering-directory/)
- [Features](https://gitlab.com/gitlab-com/www-gitlab-com/blob/master/data/features.yml)
- [Groups](https://gitlab.com/gitlab-com/www-gitlab-com/blob/master/data/stages.yml)
- [Team members](https://gitlab.com/gitlab-com/www-gitlab-com/-/tree/master/data/team_members/person)
- [Product Categories](https://gitlab.com/gitlab-com/www-gitlab-com/blob/master/data/categories.yml)
