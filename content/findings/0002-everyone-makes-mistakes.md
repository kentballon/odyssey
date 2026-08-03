---
title: "Everyone makes mistakes."
number: 2
author: "Kent Ballon"
state: "published"
date: 2024-01-12
tags: ["vulnerability", "authentication", "LDAP"]
---

## Summary

Shortly after GitLab published the [16.7.2 critical security release](https://about.gitlab.com/releases/2024/01/11/critical-security-release-gitlab-16-7-2-released/), 
which described the [account-takeover-via-password-reset vulnerability](https://docs.gitlab.com/releases/patches/patch-release-gitlab-16-7-2-released/#account-takeover-via-password-reset-without-user-interactions) 
as affecting only regular and SAML users, we flagged a gap in that 
scope assessment. Drawing on my experience with [Authentication and Authorization](https://docs.gitlab.com/auth/) 
and working withother Support Engineers to validate the behavior, 
we established that the vulnerability actually affected all authentication mechanisms, 
not just the two called out in the original post.

## Context

The advisory's account-takeover issue centered on a password reset flow. 
The initial write-up scoped the affected population to regular and SAML users, 
which reads as reasonable on its face; SAML is where password-reset-style
account-linkage bugs usually show up first. LDAP-backed accounts don't normally 
go through GitLab's own password reset flow at all, so it would be easy to 
assume they were out of scope by default.

## Details

Pulling on that assumption is what surfaced the gap. LDAP users can still end up
exposed to the same underlying flaw through paths that don't look like a 
typical password reset at first glance. Rather than treat the "LDAP doesn't use 
password reset" assumption as the end of the analysis, we worked through the 
actual [authentication paths](https://docs.gitlab.com/user/profile/user_passwords/#passwords-for-externally-authenticated-accounts) 
to confirm exposure, and cross-checked it against real LDAP-configured environments 
rather than relying on the advisory's stated scope.

To validate this we created a [fully isolated sandbox](https://handbook.gitlab.com/handbook/company/infrastructure-standards/realms/sandbox/)
and integrated an LDAP application like [phpLDAPadmin](https://github.com/leenooks/phpLDAPadmin).

![phpLDAPadmin](/static/images/phpldapadmin.png "phpLDAPadmin")

![phpLDAPadmin](/images/phpldapadmin.png "phpLDAPadmin")

{{< figure src="/images/phpldapadmin.png" title="Image Caption" alt="Alt text" class="custom-class" >}}

We replicated the [attack vector](https://cwe.mitre.org/data/definitions/640.html)
by creating new LDAP accounts and we were able to compromise them by resetting their passwords. 

Once that was confirmed, the finding needed to move fast, given the severity 
classification and the fact that customers were actively using the original scope 
statement to judge their own exposure. We escalated internally and coordinated with 
the relevant stakeholders to get the security blog post corrected:

- [Add clarity around impact of LDAP users in 16-7 blog post](gitlab.com/gitlab-com/www-gitlab-com/-/merge_requests/132419)

Because of the security classification, getting the scope right mattered more than 
getting it out fast, and prioritizing the correction meant customers relying on 
LDAP could accurately assess whether the vulnerability applied to them, 
instead of ruling themselves out based on an advisory that undercounted the affected population. 
It also kept GitLab's transparency posture intact on a critical-severity issue, 
where an inaccurate scope statement is its own kind of risk.

## References

- [16.7.2 critical security release](https://about.gitlab.com/releases/2024/01/11/critical-security-release-gitlab-16-7-2-released/)
- [Add clarity around impact of LDAP users in 16-7 blog post](gitlab.com/gitlab-com/www-gitlab-com/-/merge_requests/132419)
