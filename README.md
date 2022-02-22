# Populist Web App

## Getting Started

To get started, download the Vercel CLI tool with `npm i -g vercel`

Next, you'll need a .env file which you can pull securely with `vercel env pull` This file is .gitignored

Now, run the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3030](http://localhost:3030) with your browser to see the result.

## Development

This reposity leverages automatic code generation for GraphQL to make managing our types and fetchers seamless. You can run `yarn generate` to automatically generate our GraphQL types and data fetching hooks. This updates the `generated.tsx` file based on the queries and mutations defined in the `/graphql` directory. If you update these GraphQL files, or you are aware that the API has been modified, you'll need to run `yarn generate` to create the most recent type bindings and fetchers. We use `react-query` as our client side caching layer. All queries are automatically cached based on the provided query key. This dramatically improves client side user experience and minimizes unnecessary calls to the API.

## Deployment

This application is deployed via Vercel. You can see the dashboard at [https://vercel.com/populist][https://vercel.com/populist]
The `main` branch is automatically deployed to production. For all other branches, Vercel automatically spins up a preview deployment for you to see how your changes will behave in a production like setting. The preview deployments point to the staging API, and the produciton deployment points to our prod API and database.
