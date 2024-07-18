import {
  HydrationBoundary,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import type { AppProps } from "next/app";
import { ReactElement, ReactNode, useState } from "react";
import "styles/main.scss";
import Script from "next/script";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "highlight.js/styles/atom-one-dark.css";
import "styles/vendor/toast.css";
import { AuthProvider } from "hooks/useAuth";
import { SEO } from "components";
import { appWithTranslation } from "next-i18next";
import { NextPage } from "next";
import { DevToolbar } from "components/DevToolbar/DevToolbar";
import { OrganizationProvider } from "hooks/useOrganizationContext";

// eslint-disable-next-line @typescript-eslint/ban-types
export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

function Populist({ Component, pageProps }: AppPropsWithLayout) {
  const [queryClient] = useState(() => new QueryClient());

  const getLayout = Component.getLayout || ((page: ReactElement) => page);

  return (
    <>
      <SEO {...pageProps} />
      <link rel="stylesheet"></link>
      <div id="modal-root" />
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
        <HydrationBoundary state={pageProps.dehydratedState}>
          <AuthProvider>
            <OrganizationProvider>
            {getLayout(<Component {...pageProps} />)}
            <ToastContainer theme="dark" />
            <DevToolbar />
            </OrganizationProvider>
          </AuthProvider>
        </HydrationBoundary>
      </QueryClientProvider>
    </>
  );
}

export default appWithTranslation(Populist);
