/** @type {import('next').NextConfig} */

const runtimeCaching = require("next-pwa/cache");
const { i18n } = require("./next-i18next.config");

const withMDX = require("@next/mdx")({
  options: {
    remarkPlugins: [],
  },
});

const withPWA = require("next-pwa")({
  dest: "public",
  disable: process.env.NODE_ENV === "development",
  runtimeCaching,
});

const commitHash = require("child_process")
  .execSync('git log --pretty=format:"%h" -n1')
  .toString()
  .trim();

const nextConfig = {
  pageExtensions: ["js", "jsx", "mdx", "ts", "tsx"],
  experimental: {
    scrollRestoration: true,
  },
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
        hostname: "populist-platform-staging.s3.us-east-1.amazonaws.com",
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
    COMMIT_HASH: commitHash,
    ENV: process.env.ENV,
  },
  redirects: async () => {
    return [
      {
        source: "/dashboard/:slug/embeds",
        destination: "/dashboard/:slug/embeds/legislation",
        permanent: true,
      },
      {
        source: "/dashboard/:slug/embeds/conversation",
        destination: "/dashboard/:slug/conversations",
      },
    ];
  },
  transpilePackages: ["remotion-animated"],
};

module.exports = withPWA(withMDX(nextConfig));
