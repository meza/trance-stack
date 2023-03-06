# 6. Stack it is

Date: 2023-03-02

## Status

Accepted

Supersedes [2. Abandoning The Stack Notion](0002-abandoning-the-stack-notion.md)

## Context

The stack has undergone a lot of changes and in doing so, npm has been embraced as the package manager of choice.
This opened up the possibility of making the repo an actual remix stack.

## Decision

Ditch pnpm in favor of npm.

## Consequences

We'll have to deal with alterantive package manager support in the future.
