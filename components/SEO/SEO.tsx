import Head from "next/head";

function SEO({
  title = "Transparent democracy in action.",
  appName = "Populist",
  description = "We believe in people. In transparent, non-partisan, accessible information.",
  previewImage = "https://populist-platform.s3.us-east-2.amazonaws.com/social/preview_image.jpg",
}) {
  return (
    <Head>
      <title key="title">{`${title} | ${appName}`}</title>
      <meta name="apple-mobile-web-app-title" content="Populist" />
      <meta name="application-name" content={appName} />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="mobile-web-app-capable" content="yes" />
      <meta
        name="apple-mobile-web-app-status-bar-style"
        content="black-translucent"
      />
      <meta
        name="viewport"
        content="width=device-width,initial-scale=1,minimum-scale=1,maximum-scale=1,user-scalable=no"
      />
      <meta name="description" content={description} key="description" />

      {/* OG FB meta tags */}
      <meta property="og:image" content={previewImage} key="og:image" />
      <meta
        property="og:title"
        content={`${title} | ${appName}`}
        key="og:title"
      />
      <meta
        property="og:description"
        content={description}
        key="og:description"
      />

      {/* Twitter meta tags */}
      <meta name="twitter:card" key="twitter:card" content={previewImage} />
      <meta
        name="twitter:title"
        key="twitter:title"
        content={`${title} | ${appName}`}
      />
      <meta
        name="twitter:description"
        key="twitter:description"
        content={description}
      />
      <meta name="twitter:site" key="twitter:site" content="@populist_us" />

      {/* PWA Links */}
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
