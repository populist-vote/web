import { Hydrate, QueryClient, QueryClientProvider } from "react-query";
import type { AppProps } from "next/app";
import { useState } from "react";
import { ReactQueryDevtools } from "react-query/devtools";
import "styles/main.scss";
import Script from "next/script";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "styles/vendor/toast.css";
import "components/Scroller/Scroller.css";
import { AuthProvider } from "hooks/useAuth";
import { SEO } from "components";
import Head from "next/head";

function MyApp({ Component, pageProps }: AppProps) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <Hydrate state={pageProps.dehydratedState}>
            <Head>
              <SEO {...pageProps} />
            </Head>
            {process.env.NODE_ENV === "production" &&
              process.env.GOOGLE_ANALYTICS_ID && (
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
