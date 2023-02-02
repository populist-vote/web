import { BillWidget } from "components/BillWidget/BillWidget";
import { NextParsedUrlQuery } from "next/dist/server/request-meta";

export async function getServerSideProps({
  query,
}: {
  query: NextParsedUrlQuery;
}) {
  return {
    notFound: !query.billId,
    props: {
      billId: query.billId,
    },
  };
}

function BillWidgetPage({ billId }: { billId: string }) {
  return <BillWidget billId={billId} />;
}

export default BillWidgetPage;
