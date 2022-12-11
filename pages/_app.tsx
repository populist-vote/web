import {
  Hydrate,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import type { AppProps } from "next/app";
import { useState } from "react";
import "styles/main.scss";
import Script from "next/script";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "styles/vendor/toast.css";
import { AuthProvider } from "hooks/useAuth";
import { SEO } from "components";
import { appWithTranslation } from "next-i18next";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

function Populist({ Component, pageProps }: AppProps) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <>
      <SEO {...pageProps} />
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
      <QueryClientProvider client={queryClient}>
        <Hydrate state={pageProps.dehydratedState}>
          <AuthProvider>
            <Component {...pageProps} />
            <ToastContainer theme="dark" />
            <ReactQueryDevtools initialIsOpen={false} />
          </AuthProvider>
        </Hydrate>
      </QueryClientProvider>
    </>
  );
}

export default appWithTranslation(Populist);
