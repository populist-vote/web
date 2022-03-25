/** @type {import('next').NextConfig} */

const withPWA = require("next-pwa");
const runtimeCaching = require("next-pwa/cache");

const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [
      "static.votesmart.org",
      "populist-platform.s3.us-east-2.amazonaws.com",
    ],
    format: ["image/webp", "image/png", "image/jpeg", "image/gif"],
  },
  i18n: {
    // These are all the locales you want to support in
    // your application
    locales: ["en-US"],
    // This is the default locale you want to be used when visiting
    // a non-locale prefixed path e.g. `/hello`
    defaultLocale: "en-US",
  },
  pwa: {
    dest: "public",
    disable: process.env.NODE_ENV === "development",
    runtimeCaching,
  },
};

module.exports = withPWA(nextConfig);
