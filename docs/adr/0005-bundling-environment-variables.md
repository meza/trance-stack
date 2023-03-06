# 5. Bundling Environment Variables

Date: 2023-02-22

## Status

Accepted

Amended By [9. No more need to bundle environment variables](0009-no-more-need-to-bundle-environment-variables.md)

## Context

Architect allows us to define environment variables using AWS SSM Parameter Store.
This is a great way to manage environment variables, but it has a few drawbacks:

- It requires a separate AWS access
- It hides the environment variables from the developers and the CI system
- It sets the environment variables for the lambda function, but not for the bundling process
- A lambda function with environment variables cannot be distributed to Lambda@Edge locations

## Decision

We're going to bundle the environment variables into the lambda function using [esbuild](https://esbuild.github.io/) at
remix build time.

- We use https://github.com/yamitsushi/esbuild-plugin-env to pick up our environment variables from the `.env` file.
- We use https://github.com/webdeveric/esbuild-plugin-environment to replace all process.env references with the actual values.
- We use https://github.com/aiji42/remix-esbuild-override to override the default esbuild bundler with our own options.

## Consequences

Our bundled code will be 100% self-contained and will not require any external dependencies or control.
This also means that any change in the configuration will require a new build and a new deployment.
