# 7. ARC takes a backseat

Date: 2023-03-02

## Status

Accepted

Followed By [8. Use AWS CDK for deployments](0008-use-aws-cdk-for-deployments.md)

## Context

ARC is a great tool for a very specific use case. It's not a good fit for this stack when it comes to production deployment.
There is simply not enough flexibility in the tool to allow us to deploy the stack in a way that is suitable for our needs or
for the needs of any decently complex project.

ARC however is great for local development and emulating AWS resources.

## Decision

We're keeping ARC as a local development tool but aren't relying on it for production deployment.

## Consequences

We need to find an alternative way to handle the deployments.
