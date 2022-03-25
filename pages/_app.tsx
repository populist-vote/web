import { Hydrate, QueryClient, QueryClientProvider } from "react-query";
import type { AppProps } from "next/app";

import { ReactElement, ReactNode } from "react";
import { NextPage } from "next";

import "styles/globals.scss";
import "styles/landing.css";
import { AppHead as Head } from "components/Head/Head";

const queryClient = new QueryClient();

export type NextPageWithLayout<P = {}> = NextPage & {
  getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

function MyApp({ Component, pageProps }: AppPropsWithLayout) {
  const getLayout = Component.getLayout ?? ((page) => page);

  return (
    <QueryClientProvider client={queryClient}>
      <Hydrate state={pageProps.dehydratedState}>
        <Head />
        {getLayout(<Component {...pageProps} />)}
      </Hydrate>
    </QueryClientProvider>
  );
}

export default MyApp;
