# TRANCE STACK [![Storybook](https://cdn.jsdelivr.net/gh/storybookjs/brand@main/badge/badge-storybook.svg)](https://meza.github.io/trance-stack/)

> **Warning**
> **This stack is typescript and NPM only for now.**
>
> The NPM requirement comes from the GitHub actions scripts. I will make it possible to use both pnpm and yarn soon but it
> requires a bit more time and I would love to get feedback on the stack until then.

## Quick Start

Create your project with the stack
```bash
npx create-remix@latest --template meza/trance-stack my-app
```

Once it's done, go into the newly created directory and start the dev server
```bash
npm run dev
```

Please make sure that you go through the initialization steps of the create-remix script.

If for whatever reason it didn't run, execute the following commands:

```bash
npm i && remix init
```

---

## What is this stack?

This is a [Remix](https://remix.run) stack that offers _a_ way to ship production ready remix applications.
It is constructed in an opinionated way and is meant to be used as a starting point for your own remix projects.
You can modify it to your liking and use it as a base for your own remix projects.

## What's included

- Good security practices with CSP and sensible auth processes
- i18n with [i18next](https://www.i18next.com/) and its remix integration [rexmix-i18next](https://github.com/sergiodxa/remix-i18next)
- [Auth0](https://auth0.com/) for authentication
- [Split](https://split.io) for feature flags
- [Cookieyes](https://cookieyes.com) for cookie consent
- Analytics Integrations
  - [Mixpanel](https://mixpanel.com)
  - [Hotjar](https://hotjar.com)
  - [Google Analytics v4](https://analytics.google.com)
- Static Types with [TypeScript](https://typescriptlang.org)
- Linting with [ESLint](https://eslint.org)
- Unit testing with [Vitest](https://vitest.dev) and [Testing Library](https://testing-library.com)
- End-to-End testing with [Playwright](https://playwright.dev)
- [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) for commit messages to enable automated versioning
- [Semantic Release](https://github.com/semantic-release/semantic-release) for automatic release management
- [Storybook v7](https://storybook.js.org) for component development
- [NPM](https://docs.npmjs.com/) for package management (for now. Will have support for [yarn](https://yarnpkg.com/) and [pnpm](https://pnpm.io/) soon)
- [GitHub Actions](https://github.com/features/actions) for a full CI setup
- [AWS](https://aws.com) deployment with [CDK](https://docs.aws.amazon.com/cdk/index.html) via [GitHub Actions](https://github.com/features/actions)
  - Using AWS Lambda + Api Gateway + Cloud Front for production builds
  - Using AWS Lambda + Api Gateway for ephemeral builds (for feature branches, pull requests, etc)
- Automatic dependency updates with [Renovate](https://renovatebot.com)

## Getting Started

> **Note**
> Read this documentation on your own project's repository. It will contain links relevant to you as
> the init script will replace the links in this README with the ones customized to your project.

In order to fully use this stack, you will need to have a few things set up first.

The stack is designed in a way that makes it relatively simple to remove the parts you don't need. You will be able to
find removal instructions at every step so don't worry if you're not a fan of a particular service.

> #### But... why?
>
> We've been using [Architecture Decision Records](https://cognitect.com/blog/2011/11/15/documenting-architecture-decisions)
> throughout the development of the stack so if you ever find yourself wondering why we've chosen a particular service or
> implementation, you can check the [ADR](./doc/adr/decisions.md) page for more information.
>
> We highly encourage you to keep on adding your own decisions. It's a great way to document the historical context of your
> project, and it's a great way to share your knowledge with the rest of the team.
>
> We use [adr-tools](https://github.com/meza/adr-tools) to manage our ADRs. It is installed as part of the stack, so you
> should be able to use it right away.

> **Warning**
> This README isn't trying to teach you how to use these services, please refer to the services' documentation for that.


### Environment

If you went through the init script of the stack, you should have a `.env` file in the root of your project.
If for some reason you don't, you can copy the `.env.example` file and rename it to `.env`.

```bash
cp .env.example .env
```

This file contains all the variables you will need to set for the entire stack to function as is.

The `APP_DOMAIN` should generally stay the same. It's the domain that your application will be served from. This variable
will also be set by the deployment scripts, so you don't need to worry about it.

The `NODE_ENV` variable is used to determine which environment you're running the application in. It seems like ARC has a
hard time figuring it out on its own, so we've set it up to be set manually. If all goes well, it won't be needed for long.

### GitHub Settings

> **Note**
> The stack is meant to be used with GitHub Actions. If you're not familiar with GitHub Actions, you can read more about it
> [here](https://docs.github.com/en/actions).

You need to do a few things to make sure GitHub Actions can work with your project.

#### Workflow permissions

First, head over to https://github.com/meza/trance-stack/settings/actions and under the `Workflow permissions`
section, make sure it's on the `Read and write permissions` option.

Without this, the deployment scripts won't be able to create the necessary GitHub releases.

#### Environments

> **Note**
> We use GitHub environments to manage the different stages of our application. You can read more about them
>[here](https://docs.github.com/en/actions/deployment/targeting-different-environments).

GitHub environments are great to control the environment variables that are used in your workflows.

For now, go to https://github.com/meza/trance-stack/settings/variables/actions and create the following environments:
- `Production`
- `Staging`
- `Ephemeral`

These are referred to in [the deployment workflow](./.github/workflows/deploy.yml) for example with the `environment` key.
The `Ephemeral` environment is used for feature branches and pull requests and is referenced in the [the ephemeral workflow](./.github/workflows/ephemeralDeploy.yml).

#### Variables vs. Secrets

Some configuration values are sensitive while others are not. For example, the `COOKIEYES_TOKEN` is not sensitive, but the
`AUTH0_CLIENT_SECRET` is.
This mainly comes from the fact that some of these values will be embedded into the html of your application, and be visible
to everyone.

> **Warning**
> Please double-check the documentation of the services to ensure you're setting them up correctly.
>
> The application won't work properly if you add a secret as a variable or a variable as a secret.

### Authentication with Auth0

The stack uses [Auth0 for authentication](./doc/adr/0010-authentication-is-done-by-auth0.md).
You will need to create an account with them and [set up an application](https://auth0.com/docs/get-started/auth0-overview/create-applications).

When creating your new application, make sure to set the following settings:
1. The application type should be `Regular Web Applications`
2. Ignore the Quick Start section
3. Go to Settings and copy the `Domain` and `Client ID` and `Client Secret` and paste them in the `.env` file
4. Set the Token Endpoint Authentication Method to `Post`
5. Go to the `Allowed Callback URLs` section and add `http://localhost:3000/auth/callback`
6. Go to the `Allowed Logout URLs` section and add `http://localhost:3000`
7. Go to the `Allowed Web Origins` section and add `http://localhost:3000`
8. Go to the `Allowed Origins (CORS)` section and add `http://localhost:3000`
9. Go to the `Refresh Token Rotation` section and enable it and with that, you also have to enable the `Absolute Expiration`
   option.

#### Adding the Auth0 variables to GitHub

Now that you have your Auth0 variables, you will need to add them to the GitHub environments you created above.

Go to https://github.com/meza/trance-stack/settings/secrets/actions and add the Auth0 secrets with the same name as the
variables in the `.env` file.

You can set custom values for every environment if you want to. For example, you can set the `AUTH0_DOMAIN` to
`dev-123456.eu.auth0.com` for the `Staging` environment and `prod-123456.eu.auth0.com` for the `Production` environment.

But for the sake of simplicity, you can just set the same values only once in the main Actions secrets page, and it will
be used for all environments.

#### Enabling the Auth0 integration for feature branch/PR deployments

If you want to enable the Auth0 integration for feature branch/PR deployments, you will need to do a few extra steps.
Since the feature branch/PR deployments are ephemeral, they will have a different domain name every time they are
deployed. This means that you will need to add the domain name to the `Allowed Callback URLs` and `Allowed Logout URLs`

To make this painless, we can use the `*` wildcard in the domain name. This will allow any domain name to be used.

During the initial setup above, you have added `http://localhost:3000` in a few places.
You will need to add `,https://*.execute-api.us-east-1.amazonaws.com` to the same places.

For example, the Allowed Callback URLs section should look like this:

```text
http://localhost:3000/auth/callback,https://*.execute-api.us-east-1.amazonaws.com/auth/callback
```

> **Warning**
>
> The `*` wildcard will allow you to use as wide of a domain name as you would like to. This however comes at the cost
> of security. We would highly recommend creating an alternative tennant on Auth0 for your feature branch/PR deployments.

### CookieYes integration

The stack uses [CookieYes](https://www.cookieyes.com) for cookie consent. You will need to create an account with them and
[set up a cookie banner](https://www.cookieyes.com/category/documentation/getting-started/).

When you are prompted with installation instructions or navigate to https://app.cookieyes.com/site-settings, you will need
to copy the code following the `client_data/` in the script src and paste it in the `.env` file:

![Cookieyes Instructions](./doc/images/cookieyes.png)

You will also have to go to https://github.com/meza/trance-stack/settings/variables/actions and add the same variable
name as the one in the `.env` file.

> **Warning**
> The `COOKIEYES_TOKEN` is **set as a variable** for the actions.



### CSS

This stack uses [PostCSS](https://postcss.org) to process CSS. Remix has a built-in PostCSS plugin that allows you to
import CSS files directly into your components.

Read more about how [CSS in Remix](https://remix.run/docs/en/main/guides/styling#built-in-postcss-support) works.

```js
import styles from './styles/app.css';

export const links: LinksFunction = () => {
  return [
    { rel: 'stylesheet', href: styles }
  ];
};
```

Read more about how [CSS in Remix](https://remix.run/docs/en/v1/guides/styling#postcsss) works.



---

<!-- stack-only -->

### Development of the stack itself (delete everything below when using this for an app)

---

> **Note**
>
>A note on lockfiles.
>
> Since this is a "create" package, lockfiles are not included. This is to ensure that the latest versions of
> dependencies are used when creating a new project.
