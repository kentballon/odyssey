---
title: "Magnitude and Direction"
number: 7
author: "Kent Ballon"
state: "published"
date: 2026-03-06
tags: ["authentication","authorization","permissions"]
---

## Summary

We've uncovered an Attack Vector during an emergency escalation that compromised a GitLab instance using a [known issue](https://gitlab.com/gitlab-org/gitlab/-/work_items/413028) around [GitLab Project Access Tokens](https://docs.gitlab.com/user/project/settings/project_access_tokens/). While some damage was done, we were able to formulate a mitigation plan to address and secure their instance.

<img src="https://static.wikia.nocookie.net/despicableme/images/4/46/Vector_wallpaper.jpeg/revision/latest/scale-to-width-down/1000?cb=20160515045329" alt="Vector Perkins" style="width:100%; height:auto;">

## Context

GitLab has the concept of [Internal users](https://docs.gitlab.com/administration/internal_users/) which we can think of as "bots" for automated and background transactions.

## Details

In one scenario, a GitLab instance had a very niche implementation of project access. Instead of using [Public](https://docs.gitlab.com/user/public_access/#public-projects-and-groups) and [Private](https://docs.gitlab.com/user/public_access/#private-projects-and-groups) projects, they leveraged [Internal](https://docs.gitlab.com/user/public_access/#internal-projects-and-groups) projects quite heavily. In addition to that, they had a lot of tokens that did not have expiration dates.

Because of this, any Project Access Token can [have access to all other projects](https://gitlab.com/gitlab-org/gitlab/-/work_items/413028#note_1499970536) which we highlight this in our documentation. We do have an open [issue](https://gitlab.com/gitlab-org/gitlab/-/work_items/383882) so that this can be addresssed in future iterations of the product.

> Project access tokens are treated as internal users. If an internal user creates a project access token, that token can access all projects that have visibility level set to Internal.

One of those tokens got leaked by their user and lead to their instance being compromised.

We jumped into the fire and identified a couple of mitigation plans and walked them through the whole process.

- We had to rotate and purge Personal and Project Access tokens. 
    - [Rotate a Project Access Token](https://docs.gitlab.com/api/project_access_tokens/#rotate-a-project-access-token)
    - [Revoke a Project Access Token](https://docs.gitlab.com/api/project_access_tokens/#revoke-a-project-access-token)

- In the interim, only administrators would be able to create them using the [Rails console](https://docs.gitlab.com/administration/operations/rails_console/).
    - [Create Group Access Token with Rails Console](https://docs.gitlab.com/user/group/settings/group_access_tokens/#with-the-rails-console)
 
- We explicitly added token expiry dates as part of [best practices](https://about.gitlab.com/blog/access-token-lifetime-limits/).
- We've helped them move their internal projects to private visibility.
- We then walked them through some of the validation steps to bring their instance back to life.

While the original security exploint was not GitLab (GCP server was compromised), our timely response during the sensitive incident "ultimately" gained us our customer's trust (and ARR).

## References

- [Project Access Tokens can access any "Internal" project
](https://gitlab.com/gitlab-org/gitlab/-/work_items/413028)
- [GitLab Project Access Tokens](https://docs.gitlab.com/user/project/settings/project_access_tokens/)
- [Internal users](https://docs.gitlab.com/administration/internal_users/)
- [Public Projects](https://docs.gitlab.com/user/public_access/#public-projects-and-groups)
- [Private Projects](https://docs.gitlab.com/user/public_access/#private-projects-and-groups)
- [Internal Projects](https://docs.gitlab.com/user/public_access/#internal-projects-and-groups) 
- [Project Access Tokens should be treated as external users](https://gitlab.com/gitlab-org/gitlab/-/work_items/383882)
- [Rotate a Project Access Token](https://docs.gitlab.com/api/project_access_tokens/#rotate-a-project-access-token)
- [Revoke a Project Access Token](https://docs.gitlab.com/api/project_access_tokens/#revoke-a-project-access-token)

