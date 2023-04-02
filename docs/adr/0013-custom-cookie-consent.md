# 13. Custom Cookie Consent

Date: 2023-04-02

## Status

Accepted

## Context

The cookie laws in the EU are rather strict and require that users are informed about the cookies that are being used on
a website and that they have the ability to opt out of cookies that are not necessary for the website to function.

One of the main specifics of this is that cookies **cannot be stored** until the user has given their consent.

It is common practice to use third party providers for the consent management.

We've explored the use of:

- [Cookiebot](https://www.cookiebot.com/en/)
- [CookieYes](https://www.cookieyes.com/)
- [OneTrust](https://www.onetrust.com/)

... and a few more.

What we've discovered is that the way these providers work is by injecting a script into the page which then intercepts
all the subsequent <script> tags and replaces them with a script that will only be executed if the user has given consent.

This is a problem when you're aiming to also have a high level of XSS protection in place.

These scripts will remove the script tags and then inject them back into the page, which means that the browser will block
the script from executing.

This is a general problem across the board with all of these providers.

## Decision

In order to have both a secure solution and a solution that is compliant with the EU cookie laws, we've decided to build
our own solution.

## Consequences

Due to this, there is a bit more maintenance involved in keeping the solution up to date.

- We need to hand-craft the cookie policies that list out the cookies we use and what they are used for.
- We need to keep the cookie policies up to date with any changes to the cookies we use.

The other unfortunate consequence / trade-off is that when the user does give consent, we *must* perform a page
reload in order to inject the scripts that were blocked by the browser.

It's a small price to pay for the security and compliance.
