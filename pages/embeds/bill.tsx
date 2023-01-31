import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { NextParsedUrlQuery } from "next/dist/server/request-meta";
import { BillWidgetExternal } from "widgets/BillWidgetExternal/BillWidgetExternal";
import styles from "../../styles/modules/embed.module.scss";

const queryClient = new QueryClient();

export async function getServerSideProps({
  query,
}: {
  query: NextParsedUrlQuery;
}) {
  return {
    notFound: !query.apiKey || !query.billId,
    props: {
      apiKey: query.apiKey,
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
      <div className={styles.container}>
        <BillWidgetExternal apiKey={apiKey} billId={billId} />
      </div>
    </QueryClientProvider>
  );
}

export default BillWidgetPage;
