import { BillWidget } from "components/BillWidget/BillWidget";
import { GetServerSidePropsContext } from "next";
import { ReactNode, useEffect } from "react";
import { getOriginHost } from "utils/messages";

export async function getServerSideProps({ query }: GetServerSidePropsContext) {
  const { originHost } = getOriginHost((query.origin as string) || "");

  return {
    notFound: !query.billId,
    props: {
      billId: query.billId,
      originHost,
    },
  };
}

function BillWidgetPage({
  billId,
  originHost,
}: {
  billId: string;
  originHost: string;
}) {
  const resolvedOrigin =
    origin || (typeof location === "undefined" ? "" : location.href);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.origin !== originHost) return;
      if (typeof event.data !== "object" || !event.data.populist) return;
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [originHost]);
  return <BillWidget billId={billId} origin={resolvedOrigin} />;
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
