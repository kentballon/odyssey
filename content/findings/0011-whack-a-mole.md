---
title: "Whack-a-mole"
number: 11
author: "Kent Ballon"
state: "published"
date: 2026-01-19
tags: ["performance","troubleshooting","database","automation"]
---

## Summary

I worked on a GitLab instance where intermittent performance degradation
and request timeouts were reported after upgrading from `16.7.10` to `16.11.10`.
Initial checks covered completed migrations, PostgreSQL statistics, Sidekiq backlog, 
and system capacity, but the issue persisted. Using fast-stats against GitLabSOS logs, 
I identified a service account generating more than 5,000 Git fetch requests 
in a short amount of time.

## Context

[GitLabSOS](https://gitlab.com/gitlab-com/support/toolbox/gitlabsos) is a utility tool
we can use to quickly collect logs from a GitLab instance. 

[fast-stats](https://gitlab.com/gitlab-com/support/toolbox/fast-stats) on the other hand
is another tool we can leverage to help analyze the logs from the GitLabSOS.

80% of the time, whenever I hear performance degradatoin without prior configuration changes 
or upgrades, I get that tingling feeling that someone or something is hammering that instance.

<img src="https://static.wikia.nocookie.net/austinpowers/images/b/ba/The_mole_bloody_mole.jpg/revision/latest?cb=20150326131618" alt="Austin Powers Mole" style="width:100%; height:auto;">

## Details

### Symptom

A self-managed GitLab instance had become extremely slow after upgrading from GitLab 16.7.10 to 16.11.10.

The issue was intermittent but returned during peak hours. Users experienced slow page loads and request timeouts. 
The server also showed high CPU utilization, and the Sidekiq queue continued to grow while the issue was occurring.

Because the problem was not present all the time, I needed data collected while the 
instance was unstable rather than relying only on a performance snapshot taken afterward.

### Plan

I started with the following checks:

- Confirm whether [background migrations](https://docs.gitlab.com/update/background_migrations/) had completed.
- Confirm whether the [PostgreSQL upgrade](https://docs.gitlab.com/administration/package_information/postgresql_versions/) had completed successfully.
- Rebuild the PostgreSQL table statistics with [VACUUM ANALYZE](https://docs.gitlab.com/omnibus/settings/database/).
- Review the [GitLabSOS](https://gitlab.com/gitlab-com/support/toolbox/gitlabsos) output for CPU, memory, disk I/O, Puma, and Sidekiq symptoms.
- Use [fast-stats](https://gitlab.com/gitlab-com/support/toolbox/fast-stats) to identify any users, projects, paths, or GitLab components were generating unusual activity.
- Compare the results with the instance's deployment and automation configuration.

The initial PostgreSQL checks were reasonable because the upgrade included a PostgreSQL major version change. 
However, I did not want to assume that the upgrade itself was the root cause. 
The next step was to identify what was consuming the resources during the performance degradation.

### Findings

#### PostgreSQL statistics did not resolve the issue

The background migrations had completed, and PostgreSQL had been upgraded successfully. We checked table statistics, but the performance problem returned during peak hours.

```
sudo gitlab-psql -c "SELECT relname, last_analyze, last_autoanalyze FROM pg_stat_user_tables WHERE last_analyze IS NULL AND last_autoanalyze IS NULL;"
```

This indicated that stale PostgreSQL statistics were not the only factor involved.

#### Sidekiq was falling behind

The `GitLabSOS` data showed that the instance was generating background work faster than Sidekiq could process it. 
The number of enqueued jobs increased during the affected periods, and CPU utilization was close to the available capacity.

I reviewed the Sidekiq configuration and considered whether additional queue capacity would help. 
Each additional queue group consumes CPU and memory, so I wanted to identify the source of the 
workload before recommending a large configuration change.

#### fast-stats identified an unusually active service account

I used `fast-stats` against the GitLab [Rails](https://docs.gitlab.com/development/architecture/#puma) 
and [Gitaly](https://docs.gitlab.com/development/architecture/#gitaly) logs to break down the activity 
by user, project, path, and service.

The basic commands were similar to the following:

```
fast-stats top /var/log/gitlab/gitlab-rails/production_json.log
fast-stats top /var/log/gitlab/gitlab-rails/api_json.log
fast-stats top /var/log/gitlab/gitaly/current
fast-stats top /var/log/gitlab/sidekiq/current
```

For a more focused view, I also used sorting and percentage output:

```
fast-stats top --sort-by=cpu-s --display=percentage /var/log/gitlab/gitlab-rails/production_json.log
fast-stats top --sort-by=cpu-s --display=percentage /var/log/gitlab/gitlab-rails/api_json.log
fast-stats top --sort-by=cpu-s --display=percentage /var/log/gitlab/gitaly/current
```

The exact log paths can vary depending on the installation type and the location of the GitLabSOS files.

`fast-stats` was useful because it provided more than a raw request count. It grouped the activity by several dimensions, including:

- Users
- Projects
- Request paths
- Request duration
- Database time
- Redis time
- Gitaly time
- CPU time
- Memory usage
- Failed requests

The output showed that a service account generated more than 5,000 requests in approximately two minutes. 


| User | Count | Count % | RPS | RPS % | Duration | Dur % | DB | DB % |
|---|---|---|---|---|---|---|---|---|
| mole | 5207 | 54 | 2.50 | 54 | 9m17.0s | 56 | 2m04.4s | 59 |

| User | Redis | Redis % | Gitaly | Gitaly % | CPU | CPU % | Mem | Mem % | Fail Ct | Fail % |
|---|---|---|---|---|---|---|---|---|---|---|
| mole | 22.5s | 32 | 0.6s | 1 | 8m38.9s | 57 | 7.46 GiB | 50 | 0 | 0 |

Most of the activity appeared to be `git-upload-pack` requests, which are associated with Git fetch or pull operations. 
Unfortunately, [rate limits](https://docs.gitlab.com/administration/settings/git_http_rate_limits/) 
were not configured on this instance which is why the service account had its spree.

At that point, we poked further and tried to confirm whether the account was used by an external 
automation system and, if possible, temporarily block it to verify its impact.

#### The activity was connected to ArgoCD

We were able to confirm that the service account was recently added (and not documented/cleared) and used by ArgoCD. 
[ArgoCD](https://argo-cd.readthedocs.io/en/stable/) was configured to pull approximately 4,000 projects or applications every minute.

This explained why the GitLab instance experienced a significant increase in Git traffic during peak hours. 
When changes were detected, the resulting repository operations and pack-file generation increased CPU usage 
and placed additional pressure on Gitaly and the Rails background processing components.

#### Resolution

To test our hypothesis, we temporarily disabled the service account during peak hours and was able to validate that it was the main culprit.

We reviewed the ArgoCD polling pattern and the related service-account activity and since this was an expected new addition to their workflow, we recommended configuring the necessary [rate limits](https://docs.gitlab.com/administration/settings/git_http_rate_limits/) so that this won't happen again.

We also adjusted the instance capacity and GitLab application configuration based on the observed workload. 
This included increasing available CPU and memory and adjusting the [Puma worker configuration](https://docs.gitlab.com/administration/operations/puma/).

And that is how we figured that it was never the upgrade that caused the issue, it was that undocumented
mole that caused the issue. Whack!

<img src="https://kentballon.github.io/odyssey/images/diglett.png" alt="NLBALB" style="width:100%; height:auto;">

## References

- [GitLabSOS](https://gitlab.com/gitlab-com/support/toolbox/gitlabsos)
- [fast-stats](https://gitlab.com/gitlab-com/support/toolbox/fast-stats)
- [Background migrations](https://docs.gitlab.com/update/background_migrations/)
- [PostgreSQL upgrade](https://docs.gitlab.com/administration/package_information/postgresql_versions/)
- [VACUUM ANALYZE](https://docs.gitlab.com/omnibus/settings/database/)
- [Rails](https://docs.gitlab.com/development/architecture/#puma) 
- [Gitaly](https://docs.gitlab.com/development/architecture/#gitaly)
- [Rate limits](https://docs.gitlab.com/administration/settings/git_http_rate_limits/)
- [Puma worker configuration](https://docs.gitlab.com/administration/operations/puma/)
- [ArgoCD](https://argo-cd.readthedocs.io/en/stable/)
- [Austin Powers Mole](https://static.wikia.nocookie.net/austinpowers/images/b/ba/The_mole_bloody_mole.jpg/revision/latest?cb=20150326131618)
