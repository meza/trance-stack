# 12. Session Cookie Same Site None

Date: 2023-03-25

## Status

Accepted

## Context

We've fought long and hard to keep the session cookie same-site: lax at the minimum however we've been running into a lot
of issues.

Mainly that during the authorization process, the cookie wouldn't be sent back to us when auth0 makes a POST request to the
callback URL.

This meant that the cookie consent, the theme setting and the visitor ID all got wiped out and forgotten.

## Decision

The decision is to use the SameSite: None setting, like most of the internet does.

## Consequences

While this doesn't pose too much of an added security risk, it's still not as secure as it could be.
