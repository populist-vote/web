import { BillWidget } from "components/BillWidget/BillWidget";
import { NextParsedUrlQuery } from "next/dist/server/request-meta";
import { ReactNode } from "react";

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

BillWidgetPage.getLayout = (page: ReactNode) => (
  <div
    style={{
      marginInlineEnd: "auto",
      marginInlineStart: "auto",
    }}
  >
    {page}
  </div>
);

export default BillWidgetPage;
