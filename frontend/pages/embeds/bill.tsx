import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { NextParsedUrlQuery } from "next/dist/server/request-meta";
import { BillWidget } from "components/BillWidget/BillWidget";

const queryClient = new QueryClient();

export async function getServerSideProps({
  query,
}: {
  query: NextParsedUrlQuery;
}) {
  return {
    notFound: !query.apiKey || !query.billId,
    props: {
      apiKey: query.apiKey || process.env.NEXT_PUBLIC_API_KEY,
      billId: query.billId,
    },
  };
}

function BillWidgetPage({
  apiKey,
  billId,
}: {
  apiKey: string;
  billId: string;
}) {
  return (
    <QueryClientProvider client={queryClient}>
      <BillWidget apiKey={apiKey} billId={billId} />
    </QueryClientProvider>
  );
}

export default BillWidgetPage;
