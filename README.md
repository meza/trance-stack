# Remix Trance Stack

![The Remix Trance Stack](https://armadamusic.imgix.net/news/Trance-Music.jpg?auto=format&crop=focalpoint&fit=cover&w=1200)

Learn more about [Remix Stacks](https://remix.run/stacks).

```
npx create-remix --template meza/trace-stack
```

## What's planned for the stack

- [ ] i18n with [rexmix-i18n](https://github.com/sergiodxa/remix-i18next)
- [x] [AWS deployment](https://aws.com) with [Architect](https://arc.codes/)
- [ ] [GitHub Actions](https://github.com/features/actions) for deploy on merge to production and staging environments
- [ ] [Semantic Release](https://github.com/semantic-release/semantic-release) for version control
- [ ] [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) for commit messages
- [ ] Unit testing with [Vitest](https://vitest.dev) and [Testing Library](https://testing-library.com)
- [x] Linting with [ESLint](https://eslint.org)
- [x] Static Types with [TypeScript](https://typescriptlang.org)
- [x] PNPM for package management
- [ ] [act](https://github.com/nektos/act) to test GitHub Actions locally

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
