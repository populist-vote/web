/** @type {import('next').NextConfig} */

const runtimeCaching = require("next-pwa/cache");
const { i18n } = require('./next-i18next.config');
const path = require('path'); 


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
    locales: ["en", "es", "so", "hmn"],
    defaultLocale: "en",
    localeDetection: true,
    localePath: path.resolve("./public/locales"),
  },
  env: {
    GOOGLE_ANALYTICS_ID: process.env.GOOGLE_ANALYTICS_ID,
    GRAPHQL_SCHEMA_PATH: process.env.GRAPHQL_SCHEMA_PATH,
  },
};

module.exports = process.env.NODE_ENV === 'development' ? nextConfig : withPWA({nextConfig, i18n});
