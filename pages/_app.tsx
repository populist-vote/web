import { Hydrate, QueryClient, QueryClientProvider } from "react-query";
import type { AppProps } from "next/app";
import { ReactElement, ReactNode, useState } from "react";
import { NextPage } from "next";
import { ReactQueryDevtools } from "react-query/devtools";
import "styles/main.scss";
import Script from "next/script";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "styles/vendor/toast.css";
import "components/Scroller/Scroller.css";
import { AuthProvider } from "hooks/useAuth";
import { SEO } from "components";

// eslint-disable-next-line @typescript-eslint/ban-types
export type NextPageWithLayout<P = {}> = NextPage<P> & {
  getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

function MyApp({ Component, pageProps }: AppPropsWithLayout) {
  const [queryClient] = useState(() => new QueryClient());

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
          gtag('config', "${process.env.GOOGLE_ANALYTICS_ID}");
        `}
          </Script>
        </>
      )}
      <SEO />
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <Hydrate state={pageProps.dehydratedState}>
            <Component {...pageProps} />
            <ToastContainer theme="dark" />
            <ReactQueryDevtools initialIsOpen={false}></ReactQueryDevtools>
          </Hydrate>
        </AuthProvider>
      </QueryClientProvider>
    </>
  );
}

export default MyApp;
