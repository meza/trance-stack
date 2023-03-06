# 8. Use AWS CDK for deployments

Date: 2023-03-02

## Status

Accepted

Follows [7. ARC takes a backseat](0007-arc-takes-a-backseat.md)

## Context

We've decided against using ARC for deployment and had to find an alternative way of deploying the stack.

The options we looked at:
- [AWS CDK](https://docs.aws.amazon.com/cdk/index.html)
- [Serverless Framework](https://www.serverless.com/)
- [Terraform](https://www.terraform.io/)
- [Pulumi](https://www.pulumi.com/)

The criteria we used to evaluate the options:
- Ease of use
- Flexibility
- Community support
- Cost
- Learning curve
- Documentation
- Support for AWS services
- Ability to stay within the typescript ecosystem

## Decision

Pulumi and CDK were very close competitors in the running for this decision but in the end we chose to go with CDK.
The main reason being that the stack is built for AWS so there is no need to use a tool that supports multiple cloud providers.

## Consequences

A potential cloud migration might take more work than it would with Pulumi, but we're not planning on migrating to
another cloud provider any time soon.
