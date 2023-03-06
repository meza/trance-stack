# 9. No more need to bundle environment variables

Date: 2023-03-02

## Status

Accepted

Amends [5. Bundling Environment Variables](0005-bundling-environment-variables.md)

## Context

Previously it seemed like the only way to truly get Remix playing nice with CloudFront was with Lambda@Edge.
This meant that we had to bundle the environment variables into the lambda function.

This isn't the case anymore, and we're able to use regular lambdas.

There's also the issue of configuring the callback urls for Auth0 for the ephemeral test environments.
It wouldn't be possible to configure them if we were to bundle the environment variables into the lambda function.

## Decision

While bundling environment variables is still encouraged, we're not going to require them.

## Consequences

The lambda functions won't be able to be promoted to Lambda@Edge anymore if they have non bundled environment variables.
