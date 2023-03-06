# 3. Using Split Instead of Launch Darkly

Date: 2023-02-14

## Status

Accepted

## Context

Launch Darkly is a well respected feature flag tool however their freemium model is not suitable for our needs.
We need a tool that allows us to scale over time. LD doesn't have a free plan for an unlimited amount of time.

## Decision

We've looked at a few alternatives and have decided to go with Split.
Split allows us to use their services for free until we need to scale up.

## Consequences

We have a new tool to learn and integrate into our workflow.
