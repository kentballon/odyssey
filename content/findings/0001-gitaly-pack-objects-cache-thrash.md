---
title: "Gitaly pack-objects cache thrash under concurrent clone storms"
number: 1
author: "Kent"
state: "published"
date: 2026-06-02
tags: ["gitaly", "git", "performance"]
---

## Summary

A burst of concurrent `git clone` / `git fetch` operations against the same
large repository can defeat Gitaly's pack-objects cache instead of
benefiting from it, because each request's negotiated object set differs
just enough to produce a cache-key miss.

## Context

Investigating elevated CPU on a Gitaly node during a CI fan-out where dozens
of runners cloned the same monorepo within a few seconds of each other.
`pack-objects` was expected to serve most of these from the cache after the
first miss.

## Details

The pack-objects cache keys on the exact set of "wants"/"haves" negotiated
for a request. Shallow clones, partial clones, and runners with slightly
different local refs each produce a distinct negotiation, so instead of one
expensive `pack-objects` invocation warming the cache for everyone, we saw
one nearly per-request. On a big repo that's enough `pack-objects` CPU to
saturate the node.

Mitigations that helped:

- Standardizing CI runners on full clones with a shared reference/alternate
  where possible, so negotiation converges on the same object set.
- Bumping the cache TTL and max cache size so that even a partial hit rate
  reduced load meaningfully.
- Spreading clone storms out with jitter at the CI trigger level rather than
  letting dozens of jobs start in the same second.

## References

- Gitaly docs: pack-objects cache
- Internal incident notes, 2026-05
