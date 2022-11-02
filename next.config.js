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
  images: {
    domains: [
      "static.votesmart.org",
      "populist-platform.s3.us-east-2.amazonaws.com",
      "www.gravatar.com",
    ],
    formats: ["image/webp"],
  },
  i18n: {
    // These are all the locales you want to support in
    // your application
    locales: ["en", "es", "so", "hmn"],
    // This is the default locale you want to be used when visiting
    // a non-locale prefixed path e.g. `/hello`
    defaultLocale: "en",
    localeDetection: true,
  },
  env: {
    GOOGLE_ANALYTICS_ID: process.env.GOOGLE_ANALYTICS_ID,
    GRAPHQL_SCHEMA_PATH: process.env.GRAPHQL_SCHEMA_PATH,
  },
};

module.exports = withPWA({nextConfig, i18n});
