# TRANCE STACK [![Storybook](https://cdn.jsdelivr.net/gh/storybookjs/brand@main/badge/badge-storybook.svg)](https://meza.github.io/trance-stack/)

{% note %}

**This stack is typescript and NPM only for now.**

The NPM requirement comes from the github actions scripts. I will make it possible to use both pnpm and yarn soon but it
requires a bit more time and I would love to get feedback on the stack until then.

%{ endnote %}

```bash
npx create-remix@latest --template meza/trance-stack
```

---

## What's planned for the stack

- [x] i18n with [rexmix-i18n](https://github.com/sergiodxa/remix-i18next)
- [x] [AWS deployment](https://aws.com) with [CDK](https://docs.aws.amazon.com/cdk/index.html)
  - [x] Using AWS Lambda + Api Gateway + Cloud Front for production builds
  - [x] Using AWS Lambda + Api Gateway for ephemeral builds (for feature branches, pull requests, etc)
- [x] [GitHub Actions](https://github.com/features/actions) for a full CI steup
- [x] [Semantic Release](https://github.com/semantic-release/semantic-release) for version control
- [x] [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) for commit messages
- [x] Unit testing with [Vitest](https://vitest.dev) and [Testing Library](https://testing-library.com)
- [x] End-to-End testing with [Playwright](https://playwright.dev/docs/intro)
- [x] Linting with [ESLint](https://eslint.org)
- [x] Static Types with [TypeScript](https://typescriptlang.org)
- [x] NPM for package management
- [x] [Storybook](https://storybook.js.org) for component development
- [x] [Cookieyes](cookieyes.com) for cookie consent
- [x] [Split](https://split.io) for feature flags\
- [x] [Auth0](https://auth0.com/) for authentication
- [x] Good security practices with CSP and sensible auth processes
- [x] Automatic dependency updates with Renovate
- [x] Analytics Integrations
  - [x] Mixpanel
  - [x] Hotjar
  - [x] Google Analytics 4
- [x] Fully tested
- [ ] Fully documented
- [x] Remix.Init setup for customizing the stack

## IGNORE THIS README BELOW FOR NOW, IT'S OUT OF DATE

All you need to know for now is:
```sh
npm install
npm run dev
```

---

> ### Issues to be aware of
>
> - https://github.com/storybookjs/storybook/issues/19055#issuecomment-1327944959

![The Remix Trance Stack](https://armadamusic.imgix.net/news/Trance-Music.jpg?auto=format&crop=focalpoint&fit=cover&w=1200)

Learn more about [Remix Stacks](https://remix.run/stacks).

```
npx create-remix --template meza/trace-stack
```

---

> ## A note on lockfiles
>
> Since this is a "create" package, lockfiles are not included. This is to ensure that the latest versions of
> dependencies are used when creating a new project.

---

Not a fan of bits of the stack? Fork it, change it, and use `npx create-remix --template your/repo`! Make it your own.

## Development

### Setup

This stack uses [pnpm](https://pnpm.io/) for package management. If you don't have it installed, you can install it
with:

```sh
npmx pnpm i
```

In order to make thing work locally, create a file called `.env` in the root of the project and add the following:

```sh
NODE_ENV=development
```

### Running

- Start the dev server:

```sh
pnpm dev
```

### CSS

We're using vanilla CSS with PostCSS for the stack.
You can add your own CSS files to the `<projectRoot>/styles` directory.
They will be automagically picked up and transformed by PostCSS.

PostCSS writes the transformed CSS files into the `src/styles` directory and this is where you should import them
from in your components.

With Remix, you need to include these styles in the links function of your routes.

```js
import styles from './styles/app.css';

export const links: LinksFunction = () => {
  return [
    { rel: 'stylesheet', href: lightStyles }
  ];
};
```

Read more about how [CSS in Remix](https://remix.run/docs/en/v1/guides/styling#postcsss) works.


### Deployment

#### Repository Secrets

- ARC_APP_SECRET
- AWS_ACCESS_KEY_ID
- AWS_SECRET_ACCESS_KEY
- SESSION_SECRET
- SPLIT_SERVER_TOKEN

#### Repository Variables

- COOKIEYES_TOKEN
- HOTJAR_ID
- MIXPANEL_API
- MIXPANEL_TOKEN

#### Custom domains

This stack doesn't manage domain names at all mainly because ARC doesn't either. To find out how to set them up,
read the [ARC docs](https://arc.codes/docs/en/guides/domains/registrars/route53-and-cloudfront).
