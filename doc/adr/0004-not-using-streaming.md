# 4. Not Using Streaming

Date: 2023-02-18

## Status

Accepted

## Context

Remix/React streaming is definitely the future however it is currently not supported by the
AWS lambda environment.

To leverage the benefits of streaming we would need to move to a serverless environment that
supports streaming.

Or we could not use streaming and go with AWS lambda.

## Decision

For this template, we're going to go with the simple solution of not using streaming and
enabling AWS lambda instead.

## Consequences

Projects originating from this template will have to make their own calls about what to do.
