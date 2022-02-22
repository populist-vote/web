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

## Deployment

This application is deployed via Vercel. You can see the dashboard at [https://vercel.com/populist][https://vercel.com/populist]
The `main` branch is automatically deployed to production. For all other branches, Vercel automatically spins up a preview deployment for you to see how your changes will behave in a production like setting. The preview deployments point to the staging API, and the produciton deployment points to our prod API and database.
