import "../styles/globals.scss";
import "../styles/landing.css";
import { Hydrate, QueryClient, QueryClientProvider } from "react-query";
import type { AppProps } from "next/app";
import Head from "next/head";
import { AppContextProvider } from "../context/App";

const queryClient = new QueryClient();

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <AppContextProvider>
      <QueryClientProvider client={queryClient}>
        <Hydrate state={pageProps.dehydratedState}>
          <Head>
            <title>Populist</title>
            <meta
              name="viewport"
              content="width=device-width, initial-scale=1, maximum-scale=1"
              key="viewport"
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

            <link
              rel="apple-touch-icon"
              href="https://populist-static-assets.s3.amazonaws.com/images/LogoFlag.svg"
            />
            <link rel="icon" href="/favicon.ico" />
          </Head>
          <Component {...pageProps} />
        </Hydrate>
      </QueryClientProvider>
    </AppContextProvider>
  );
}

export default MyApp;
