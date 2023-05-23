import { BillWidget } from "components/BillWidget/BillWidget";
import { PoliticianWidget } from "components/PoliticianWidget/PoliticianWidget";
import { PollWidget } from "components/PollWidget/PollWidget";
import { QuestionWidget } from "components/QuestionWidget/QuestionWidget";
import { useEmbedByIdQuery } from "generated";
import { GetServerSidePropsContext } from "next";
import { useEffect } from "react";
import { getOriginHost } from "utils/messages";

export async function getServerSideProps({ query }: GetServerSidePropsContext) {
  const { originHost } = getOriginHost((query.origin as string) || "");

  return {
    props: {
      embedId: query.id,
      originHost,
    },
  };
}

function EmbedPage({
  embedId,
  originHost,
}: {
  embedId: string;
  originHost: string;
}) {
  const { data, error, isLoading } = useEmbedByIdQuery({
    id: embedId,
  });

  const embedType = data?.embedById?.attributes?.embedType;
  const billId = data?.embedById?.attributes?.billId;
  const politicianId = data?.embedById?.attributes?.politicianId;
  const renderOptions = data?.embedById?.attributes?.renderOptions || {};

  const resolvedOrigin =
    originHost || (typeof location === "undefined" ? "" : location.href);

  // Track resolved origin in database so we know where embeds are being used

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.origin !== originHost) return;
      if (typeof event.data !== "object" || !event.data.populist) return;
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [originHost]);

  if (isLoading) return null;
  if (error) return <div>This embed does not exist</div>;

  switch (embedType) {
    case "legislation":
      return (
        <BillWidget
          billId={billId}
          embedId={embedId}
          origin={resolvedOrigin}
          renderOptions={renderOptions}
        />
      );
    case "politician":
      return (
        <PoliticianWidget
          politicianId={politicianId}
          embedId={embedId}
          origin={resolvedOrigin}
          renderOptions={renderOptions}
        />
      );
    case "questionn":
      return <QuestionWidget embedId={embedId} origin={resolvedOrigin} />;
    case "poll":
      return <PollWidget embedId={embedId} origin={resolvedOrigin} />;
  }
}

export default EmbedPage;
