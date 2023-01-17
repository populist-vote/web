# Populist Web App

## Getting Started

To get started, you'll need a `.env` file. You can simply `cp .env.example .env` and reach out to someone on the team to get the more sensitive credentials if necessary. Alternatively, if you have an account setup with Vercel, you can download their CLI with `npm i -g vercel` and then pull one down securely with `vercel env pull`. This file is .gitignored

First, download the necessary dependencies with `pnpm install`

Then, run `pnpm generate` to generate the typings and hooks from the Populist API. More on this below.

Now you can run the development server:

```bash
pnpm run dev
# or
npm run dev
# or
yarn dev
```

Open [http://localhost:3030](http://localhost:3030) with your browser to see the result.

## Development

This repository leverages automatic code generation for GraphQL to make managing our types and fetchers seamless. You can run `pnpm generate` to automatically generate TypeScript type bindings, an updated GraphQL schema, and typed hooks for fetching data. This command updates the `generated.tsx` file based on the queries and mutations defined in the `/graphql` directory. If you update these GraphQL files, or you are aware that the API has been modified, you'll need to run `pnpm generate` to create the most recent type bindings and fetchers. We use `react-query` as our client side caching layer. All queries are automatically cached based on the provided query key. This dramatically improves client side user experience and minimizes unnecessary calls to the API.

## Deployment

This application is deployed via Vercel. You can see the dashboard at [https://vercel.com/populist](https://vercel.com/populist).
The `main` branch is automatically deployed to [staging](staging.populist.us).  The `production` branch is automatically deployed to [production](populist.us). For all other branches, Vercel automatically spins up a preview deployment for you to see how your changes will behave in a production like setting. The preview deployments point to the staging API, and the production deployment points to our prod API and database.
