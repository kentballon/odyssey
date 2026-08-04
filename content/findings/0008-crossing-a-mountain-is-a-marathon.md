---
title: "Crossing a mountain is a marathon"
number: 8
author: "Kent Ballon"
state: "published"
date: 2025-08-26
tags: ["geo","gitaly","migration","upgrade"]
---

## Summary

I took the lead in expanding a potentially large customer for GitLab. They were relatively new customers ( a year or so) and were exploring to expand further by implementing the platform across their other subsidiaries. The problem at hand was they were not having the best experience with their production environment due to their technical limitations. Additionally, there was a language barrier which prolonged technical discussions.

## Context

For this engagement, we recognized the pain points of the customer and tried to understand their own constraints for their deployments. 
We've established an agreement of what they envisioned the future would be and explicitly pointed out the areas where we can help with. For what it's worth, it definitely felt like crossing a mountain.

## Details

In this specific scenario, their problems were mainly coming from using [non-stateful Gitaly components](https://docs.gitlab.com/administration/reference_architectures/#stateful-components-in-kubernetes) in their large [reference architecture](https://docs.gitlab.com/administration/reference_architectures/) which was not generally available (GA) [up until recently](https://docs.gitlab.com/administration/gitaly/kubernetes/#context). 

<img src="https://docs.gitlab.com/administration/gitaly/img/shard_example_v13_3.png" alt="Gitaly" style="width:100%; height:auto;">

To add on top of that, they were heavily using [GitLab Geo](https://docs.gitlab.com/administration/geo/) which added to the overall load on the environments. 

<img src="https://docs.gitlab.com/administration/geo/img/geo_architecture_v13_8.png" alt="GitLab Geo" style="width:100%; height:auto;">

For this marathon we helped them migrate to a supported architecture. It took us 3 months to iron out their options, and assisted them prepare and validate their migration plans that management can vouch for (yes, we actually helped them with their internal docs). We answered 50+ detailed questions from the team and management, to be fair they
were very cautious of certain items and we had to provide better context to address them.

It took us another 3 months of having close guidance for all activities (that's us having weekly calls to go through the steps ensuring nothing will break). I'd like to think being stubborn enough to endure such cases made me better.

Long story short, they were able to successfully migrate and overcome all technical issues earlier and continue to be a happy customer. I did in fact receive recognition and [discretionary bonus](https://handbook.gitlab.com/handbook/total-rewards/incentives/#discretionary-bonuses) for the stint so I guess a win is a win.

## References

- [Stateful Components in Kubernetes](https://docs.gitlab.com/administration/reference_architectures/#stateful-components-in-kubernetes)
- [GitLab Reference Architecture](https://docs.gitlab.com/administration/reference_architectures/)
- [GitLab Geo](https://docs.gitlab.com/administration/geo/)
- [Discretionary Bonus](https://handbook.gitlab.com/handbook/total-rewards/incentives/#discretionary-bonuses)
