import { BillWidget } from "components/BillWidget/BillWidget";
import { useEmbedByIdQuery } from "generated";
import { GetServerSidePropsContext } from "next";
import { ReactNode, useEffect } from "react";
import { getOriginHost } from "utils/messages";

export async function getServerSideProps({ query }: GetServerSidePropsContext) {
  const { originHost } = getOriginHost((query.origin as string) || "");

  return {
    notFound: !query.billId,
    props: {
      billId: query.billId,
      embedId: query.embedId,
      originHost,
    },
  };
}

function BillWidgetPage({
  billId,
  embedId,
  originHost,
}: {
  billId: string;
  embedId: string;
  originHost: string;
}) {
  const { data, isLoading } = useEmbedByIdQuery({
    id: embedId,
  });

  const renderOptions = data?.embedById?.attributes?.renderOptions || {};

  const resolvedOrigin =
    originHost || (typeof location === "undefined" ? "" : location.href);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.origin !== originHost) return;
      if (typeof event.data !== "object" || !event.data.populist) return;
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [originHost]);

  if (isLoading) return null;

  return (
    <BillWidget
      billId={billId}
      embedId={embedId}
      origin={resolvedOrigin}
      renderOptions={renderOptions}
    />
  );
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
