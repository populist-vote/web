import { BillWidget } from "components/BillWidget/BillWidget";
import { PoliticianWidget } from "components/PoliticianWidget/PoliticianWidget";
import { PollWidget } from "components/PollWidget/PollWidget";
import { QuestionWidget } from "components/QuestionWidget/QuestionWidget";
import { RaceWidget } from "components/RaceWidget/RaceWidget";
import {
  EmbedType,
  useEmbedByIdQuery,
  usePingEmbedOriginMutation,
} from "generated";
import { GetServerSidePropsContext } from "next";
import { useEffect } from "react";
import { getOriginHost } from "utils/messages";

interface EmbedPageProps {
  embedId: string;
  origin: string;
  originHost: string;
}

export async function getServerSideProps({ query }: GetServerSidePropsContext) {
  const { originHost } = getOriginHost((query.origin as string) || "");

  return {
    props: {
      embedId: query.id,
      origin: query.origin,
      originHost,
    },
  };
}

function EmbedPage({ embedId, origin, originHost }: EmbedPageProps) {
  const resolvedOrigin =
    originHost || (typeof location === "undefined" ? "" : location.href);

  const pingEmbedOriginMutation = usePingEmbedOriginMutation();
  const { data, error, isLoading } = useEmbedByIdQuery(
    {
      id: embedId,
    },
    {
      onSuccess: () => {
        pingEmbedOriginMutation.mutate({ input: { embedId, url: origin } });
      },
    }
  );
  const embedType = data?.embedById?.embedType;

  const billId = data?.embedById?.attributes?.billId;
  const politicianId = data?.embedById?.attributes?.politicianId;
  const raceId = data?.embedById?.attributes?.raceId;
  const renderOptions = data?.embedById?.attributes?.renderOptions || {};

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
    case EmbedType.Legislation:
      return (
        <BillWidget
          billId={billId}
          embedId={embedId}
          origin={resolvedOrigin}
          renderOptions={renderOptions}
        />
      );
    case EmbedType.Politician:
      return (
        <PoliticianWidget
          politicianId={politicianId}
          embedId={embedId}
          origin={resolvedOrigin}
          renderOptions={renderOptions}
        />
      );
    case EmbedType.Race:
      return (
        <RaceWidget
          raceId={raceId}
          embedId={embedId}
          origin={resolvedOrigin}
          renderOptions={renderOptions}
        />
      );
    case EmbedType.Question:
      return <QuestionWidget embedId={embedId} origin={resolvedOrigin} />;
    case EmbedType.Poll:
      return <PollWidget embedId={embedId} origin={resolvedOrigin} />;
  }
}

export default EmbedPage;
