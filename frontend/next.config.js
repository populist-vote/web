/** @type {import('next').NextConfig} */

const runtimeCaching = require("next-pwa/cache");
const { i18n } = require('./next-i18next.config');


const withPWA = require('next-pwa')({
  dest: "public",
    disable: process.env.NODE_ENV === "development",
    runtimeCaching,
})


const nextConfig = {
  reactStrictMode: true,
  i18n,
  images: {
    domains: [
      "static.votesmart.org",
      "populist-platform.s3.us-east-2.amazonaws.com",
      "www.gravatar.com",
    ],
    formats: ["image/webp"],
  },
  env: {
    GOOGLE_ANALYTICS_ID: process.env.GOOGLE_ANALYTICS_ID,
    GRAPHQL_SCHEMA_PATH: process.env.GRAPHQL_SCHEMA_PATH,
    POPULIST_API_KEY: process.env.POPULIST_API_KEY,
  },
  transpilePackages: []
};

module.exports = withPWA(nextConfig);
