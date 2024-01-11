# 14. Removing Remix Eslint

Date: 2024-01-11

## Status

Accepted

## Context

The Remix Eslint package has been in the way of upgrading eslint itself by having a very strict hold on the compatible peer dependency versions.

## Decision

We removed the package in favour of maintaining a ruleset ourselves.

## Consequences

The remix rules will need to be migrated and evaluated. It adds a bit of a duplication but also unlocks the possibility of adapting to the new eslint standards faster.
