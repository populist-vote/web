import { Hydrate, QueryClient, QueryClientProvider } from "react-query";
import type { AppProps } from "next/app";

import { ReactElement, ReactNode } from "react";
import { NextPage } from "next";
import { ReactQueryDevtools } from "react-query/devtools";

import "styles/globals.scss";
import "styles/landing.css";
import { AppHead as Head } from "components/Head/Head";
import Script from "next/script";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "styles/toast.css";
import "components/Scroller/Scroller.css";

const queryClient = new QueryClient();

export type NextPageWithLayout<> = NextPage & {
  getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

function MyApp({ Component, pageProps }: AppPropsWithLayout) {
  const getLayout = Component.getLayout ?? ((page) => page);

  return (
    <>
      {process.env.NODE_ENV === "production" && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${process.env.GOOGLE_ANALYTICS_ID}`}
            strategy="afterInteractive"
          />
          <Script id="google-analytics" strategy="afterInteractive">
            {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){window.dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', ${process.env.GOOGLE_ANALYTICS_ID});
        `}
          </Script>
        </>
      )}

      <QueryClientProvider client={queryClient}>
        <Hydrate state={pageProps.dehydratedState}>
          <Head />
          {getLayout(<Component {...pageProps} />)}
          <ToastContainer theme="dark" />
          <ReactQueryDevtools initialIsOpen={false}></ReactQueryDevtools>
        </Hydrate>
      </QueryClientProvider>
    </>
  );
}

export default MyApp;
