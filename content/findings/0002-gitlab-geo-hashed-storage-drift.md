---
title: "Geo secondary drift after a bulk @hashed path migration"
number: 2
author: "Kent"
state: "notes"
date: 2026-07-14
tags: ["gitlab-geo", "storage"]
---

## Summary

Working notes on how a primary-side bulk repository storage migration can
leave a Geo secondary in a state where the sync worker believes it is
current, but the on-disk `@hashed` paths have quietly diverged.

## Context

Captured while digging into a customer report of missing objects on a Geo
secondary after a large repository reshuffle on the primary.

## Details

Still filling this in — leaving as working notes for now rather than a
polished write-up. Key threads to pull on:

- How the Geo log cursor advances relative to the replication event that
  actually recorded the path change.
- Whether the secondary's sync worker treats a path-only change as
  equivalent to no change at all.
- Whether a forced re-verification catches drift that a normal sync pass
  would miss.

## References

-
