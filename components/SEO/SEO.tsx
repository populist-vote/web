import Head from "next/head";
import { useRouter } from "next/router";

const DEFAULT_PREVIEW_IMAGE_URL =
  "https://populist-platform.s3.us-east-2.amazonaws.com/social/preview_image.jpg";

function SEO({
  title = "Populist | Civic Data and Engagement",
  appName = "Populist",
  description = "Populist sources, structures, links and delivers best-in-class civic data and provides a suite of tools that power transparent democracy. Easily enhance your organization's civic engagement and reporting.",
  previewImage = DEFAULT_PREVIEW_IMAGE_URL,
}) {
  const { pathname } = useRouter();
  const compoundTitle = pathname == "/" ? title : `${title} | ${appName}`;
  return (
    <Head>
      <title key="title">{compoundTitle}</title>
      <meta
        name="viewport"
        content="width=device-width,initial-scale=1,minimum-scale=1,maximum-scale=5,user-scalable=yes"
      />
      <meta key="description" name="description" content={description} />

      {/* OG FB meta tags */}
      <meta key="og_type" property="og:type" content="website" />
      <meta key="og_image" property="og:image" content={previewImage} />
      <meta key="og_title" property="og:title" content={title} />
      <meta
        key="og_description"
        property="og:description"
        content={description}
      />

      {/* Twitter meta tags */}
      <meta
        key="twitter_card"
        name="twitter:card"
        content="summary_large_image"
      />
      <meta key="twitter_image" name="twitter:image" content={previewImage} />
      <meta key="twitter_site" name="twitter:site" content="@populist_us" />
      <meta key="twitter_title" name="twitter:title" content={title} />
      <meta
        key="twitter_description"
        name="twitter:description"
        content={description}
      />

      {/* PWA Links */}
      <meta name="apple-mobile-web-app-title" content="Populist" />
      <meta name="application-name" content={appName} />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="black" />
      <link rel="shortcut icon" href="/images/favicon.ico" />
      <link rel="apple-touch-icon" href="/icons/icon-144x144.png" />
      <link
        rel="icon"
        type="image/png"
        sizes="32x32"
        href="/icons/icon-32x32.png"
      />
      <link
        rel="icon"
        type="image/png"
        sizes="16x16"
        href="/icons/icon-16x16.png"
      />
      <link rel="manifest" href="/manifest.json" />
    </Head>
  );
}

export { SEO };
