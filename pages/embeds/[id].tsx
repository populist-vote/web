import { useQuery } from "@tanstack/react-query";
import { BillTrackerWidget } from "components/BillTrackerWidget/BillTrackerWidget";
import { BillWidget } from "components/BillWidget/BillWidget";
import { CandidateGuideEmbed } from "components/CandidateGuideEmbed/CandidateGuideEmbed";
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
      origin: query.origin || "",
      originHost,
    },
  };
}

export function Embed({ embedId, origin, originHost }: EmbedPageProps) {
  const resolvedOrigin =
    originHost || (typeof location === "undefined" ? "" : location.href);

  const pingEmbedOriginMutation = usePingEmbedOriginMutation();
  const { data, error, isLoading } = useQuery({
    queryKey: useEmbedByIdQuery.getKey({ id: embedId }),
    queryFn: useEmbedByIdQuery.fetcher({ id: embedId }),
  });

  useEffect(() => {
    if (!resolvedOrigin) return;
    pingEmbedOriginMutation.mutate({ input: { embedId, url: origin } });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const embedType = data?.embedById?.embedType;

  const billId = data?.embedById?.attributes?.billId;
  const billIds = data?.embedById?.attributes?.billIds;
  const politicianId = data?.embedById?.attributes?.politicianId;
  const raceId = data?.embedById?.attributes?.raceId;
  const candidateGuideId = data?.embedById?.attributes?.candidateGuideId;
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
    case EmbedType.LegislationTracker:
      return (
        <BillTrackerWidget
          billIds={billIds}
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
    case EmbedType.CandidateGuide:
      return (
        <CandidateGuideEmbed
          embedId={embedId}
          origin={resolvedOrigin}
          candidateGuideId={candidateGuideId}
          renderOptions={renderOptions}
        />
      );
    default:
      return <div>This embed type has not been implemented yet.</div>;
  }
}

export default Embed;
