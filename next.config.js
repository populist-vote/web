/** @type {import('next').NextConfig} */

const runtimeCaching = require("next-pwa/cache");
const { i18n } = require("./next-i18next.config");

const withPWA = require("next-pwa")({
  dest: "public",
  disable: process.env.NODE_ENV === "development",
  runtimeCaching,
});

const nextConfig = {
  reactStrictMode: true,
  i18n,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "static.votesmart.org",
      },
      {
        protocol: "https",
        hostname: "populist-platform-staging.s3.amazonaws.com",
      },
      {
        protocol: "https",
        hostname: "populist-platform.s3.us-east-2.amazonaws.com",
      },
      {
        protocol: "https",
        hostname: "www.gravatar.com",
      },
      {
        protocol: "https",
        hostname: "www.google.com",
        pathname: "/s2/favicons",
      },
      {
        protocol: "https",
        hostname: "icons.duckduckgo.com",
        pathname: "**",
      },
    ],
    formats: ["image/webp"],
  },
  env: {
    GOOGLE_ANALYTICS_ID: process.env.GOOGLE_ANALYTICS_ID,
    GRAPHQL_SCHEMA_PATH: process.env.GRAPHQL_SCHEMA_PATH,
    POPULIST_API_KEY: process.env.POPULIST_API_KEY,
  },
  redirects: async () => {
    return [
      {
        source: "/dashboard/:slug/embeds",
        destination: "/dashboard/:slug/embeds/legislation",
        permanent: true,
      },
    ];
  },
};

module.exports = withPWA(nextConfig);
