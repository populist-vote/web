import '../styles/globals.scss'
import '../styles/landing.css'
import { QueryClient, QueryClientProvider } from "react-query";
import type { AppProps } from 'next/app'

const queryClient = new QueryClient();

function MyApp({ Component, pageProps }: AppProps) {
  return (
  <QueryClientProvider client={queryClient}>
    <Component {...pageProps} />
    </QueryClientProvider>
    )
}

export default MyApp
