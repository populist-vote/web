import Head from "next/head";

export function AppHead() {
  return (
    <Head>
      <title>Populist</title>
      <meta name="application-name" content="Populist" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta
        name="apple-mobile-web-app-status-bar-style"
        content="black-translucent"
      />
      <meta name="apple-mobile-web-app-title" content="Populist" />
      <meta name="format-detection" content="telephone=no" />
      <meta name="mobile-web-app-capable" content="yes" />
      <meta
        name="viewport"
        content="width=device-width,initial-scale=1,minimum-scale=1,maximum-scale=1,user-scalable=no"
      />
      <meta
        name="description"
        content="We believe in people. In transparent, non-partisan, accessible information."
        key="description"
      />

      {/* OG FB meta tags */}
      <meta
        property="og:image"
        content="https://populist-static-assets.s3.amazonaws.com/social/preview-image-fb.jpg"
        key="og:image"
      />
      <meta
        property="og:title"
        content="Populist - Non-partisan politics for the people."
        key="og:title"
      />
      <meta
        property="og:description"
        content="We believe in people. In transparent, non-partisan, accessible information."
        key="og:description"
      />

      {/* Twitter meta tags */}
      <meta
        name="twitter:card"
        content="https://populist-static-assets.s3.amazonaws.com/social/preview-image-fb.jpg"
      />
      <meta
        name="twitter:title"
        content="Populist - Non-partisan politics for the people."
      />
      <meta
        name="twitter:description"
        content="We believe in people. In transparent, non-partisan, accessible information."
      />
      <meta name="twitter:site" content="@populist_us" />

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
