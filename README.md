# Remix Demo

## Features

- [x] Username login (without password)
- [x] Show list of heros from Marvel API: https://developer.marvel.com/
- [x] Show detail of a hero from hero list
  - [x] Mark hero as liked.
  - [x] Set hero note (from 0 to 10)
  - [x] Add a comment
- [x] 3 Best heros showcase
  - [x] 1 point per like
  - [x] 2 points per comment

## Powered by

- **Remix** for back API and front-end.
- **TaliwindCSS** for fast UI prototyping (and Flowbite/Tailwind UI copy pasting)
- **Prisma** for database ORM.
- **Vitest** for unit and integration testing.

## Pre-requisites

- [Marvel API Credentials](https://developer.marvel.com/documentation/getting_started)
- Install correct Node version:
  - `22.6`
  - Or use [NVM](https://github.com/nvm-sh/nvm) and use command `nvm use`.

## Development

1. Create environment variables:

   ```shellscript
   cp .env.example .env
   # Add your own Marvel credentials before passing to next step!
   ```

2. Create DB and apply migrations:

   ```shellscript
   npm run migrate
   ```

3. Run the dev server:

   ```shellscript
   npm run dev
   ```

## Relevant implementations

- Mixed front-end and back-end pagination with client prefetch to create a fast pagination experience. See [useHeroList](./app/src/hooks/useHeroList.ts) hook.
- [Optimistic UI](https://javascript.plainenglish.io/what-is-optimistic-ui-656b9d6e187c) in hero pages with state reverts on errors. See [useHero](./app/src/hooks/useHero.ts).
