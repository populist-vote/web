import { useQuery } from "@tanstack/react-query";
import { BillTrackerWidget } from "components/BillTrackerWidget/BillTrackerWidget";
import { BillWidget } from "components/BillWidget/BillWidget";
import { CandidateGuideEmbed } from "components/CandidateGuideEmbed/CandidateGuideEmbed";
import { ConversationEmbed } from "components/ConversationEmbed/ConversationEmbed";
import { PoliticianEmbed } from "components/PoliticianEmbed/PoliticianEmbed";
import { PollWidget } from "components/PollWidget/PollWidget";
import { QuestionWidget } from "components/QuestionWidget/QuestionWidget";
import { RaceWidget } from "components/RaceWidget/RaceWidget";
import {
  EmbedType,
  useEmbedByIdQuery,
  usePingEmbedOriginMutation,
} from "generated";
import { useEffect } from "react";
import { getOriginHost } from "utils/messages";

import { SupportedLocale } from "types/global";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import nextI18nextConfig from "next-i18next.config";
import { MyBallotEmbed } from "components/MyBallotEmbed/MyBallotEmbed";

interface EmbedPageProps {
  embedId: string;
  origin: string;
  originHost: string;
}

export async function getServerSideProps({
  query,
  locale,
}: {
  query: { id: string; origin: string };
  locale: SupportedLocale;
}) {
  const { originHost } = getOriginHost((query.origin as string) || "");

  return {
    props: {
      embedId: query.id,
      origin: query.origin || "",
      originHost,
      ...(await serverSideTranslations(
        locale,
        ["auth", "common", "embeds"],
        nextI18nextConfig
      )),
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
    pingEmbedOriginMutation.mutate({
      input: { embedId, url: origin },
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const embedType = data?.embedById?.embedType;

  const billId = data?.embedById?.attributes?.billId;
  const billIds = data?.embedById?.attributes?.billIds;
  const raceId = data?.embedById?.attributes?.raceId;
  const candidateGuideId = data?.embedById?.attributes?.candidateGuideId;
  const electionId = data?.embedById?.attributes?.electionId;
  // const conversationId = data?.embedById?.attributes?.conversationId;
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
        <PoliticianEmbed
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
    case EmbedType.MyBallot:
      return (
        <MyBallotEmbed
          embedId={embedId}
          origin={resolvedOrigin}
          electionId={electionId}
          renderOptions={renderOptions}
        />
      );
    case EmbedType.Conversation:
      return (
        <ConversationEmbed
          embedId={embedId}
          origin={resolvedOrigin}
          _renderOptions={renderOptions}
        />
      );
    default:
      return <div>This embed type has not been implemented yet.</div>;
  }
}

export default Embed;
