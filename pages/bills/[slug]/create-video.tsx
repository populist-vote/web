import { Player } from "@remotion/player";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import { LegislationVideo } from "../../../video/legislationVideo/Video";
import {
  defaultMyCompProps,
  VIDEO_FPS,
  VIDEO_HEIGHT,
  VIDEO_WIDTH,
  SCENE_LENGTH_IN_FRAMES,
  SUMMARY_SCENE_LENGTH_IN_FRAMES,
} from "types/constants";
import type { BillResult, PoliticianResult } from "generated";
import { useBillBySlugQuery } from "generated";
import { calculateScenes } from "../../../utils/calculateScenes";

import React, { useState } from "react";

import Link from "next/link";

import { RenderControls } from "../../../components/Video/RenderControls";
import { Spacing } from "../../../components/Video/Spacing";

const container: React.CSSProperties = {
  maxWidth: 768,
  margin: "auto",
  marginBottom: 20,
  padding: 10,
  backgroundColor: "var(--blue-darker)",
};

const player: React.CSSProperties = {
  width: "50%",
};

const CreateVideoPage: NextPage = () => {
  const [text, setText] = useState<string>(defaultMyCompProps.billResult.title);

  const router = useRouter();
  const { slug } = router.query;
  const { data, isLoading, error } = useBillBySlugQuery({
    slug: slug as string,
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.toString()}</div>;
  if (!data?.billBySlug) return null;

  const billResult = data.billBySlug as BillResult;
  const sponsors = billResult?.sponsors as PoliticianResult[];

  const summary =
    billResult?.populistSummary ||
    billResult?.description ||
    billResult?.officialSummary ||
    null;

  const { totalInnerScenesCount, summaryScenesCount } = calculateScenes(
    summary,
    billResult.legiscanData,
    sponsors
  );

  // const description = billResult?.description ?? "";

  const inputProps = {
    // billResult: billResult || {},
    summaryScenesCount: summaryScenesCount,
    summary: summary ?? "",
    // fullTextUrl: billResult.fullTextUrl ?? undefined, // Ensure fullTextUrl is string or undefined

    // title: billResult?.title || "Default Title",
    // billTitle: billResult?.billTitle || "Default Bill Title",
  };

  console.log("1. create-video inputProps:", inputProps);

  return (
    <div>
      <h1>Generate Video Content</h1>

      <p>
        Generate a 9:16 video perfect for sharing on TikTok, Instagram, and
        other social media platforms. Customize your video to suit your needs
        and, when you're ready, click "Generate Video". After the video is
        processed, you can download it directly from the provided link.
      </p>

      <div
        style={{
          padding: "2rem",
          backgroundColor: "var(--blue-darkest)",
          width: "400px",
          position: "absolute",
        }}
      >
        <h3>Debug area</h3>
        <ul>
          {[
            {
              id: "mnhf1002023-2024",
              description: "1 page summary, h&s votes, lots of d sponsors",
            },
            {
              id: "mnsf18842023-2024",
              description: "no summary, no votes, 3 dem sponsors",
            },
            {
              id: "us-hb2772-2023-2024",
              description: "2 issue tags, summary, no votes, no sponsors",
            },
            {
              id: "mnhf14402023-2024",
              description: "multi sentence summary",
            },
            {
              id: "mnhf9172023-2024",
              description: "only house vote, 3-6 sponsors",
            },
            {
              id: "mnhf1732023-2024",
              description: "33 sponsors",
            },
            {
              id: "mnsf22002023-2024",
              description: "2 sponsors",
            },
            {
              id: "mnsf1712023-2024",
              description: "1 sponsor",
            },
          ].map((bill) => (
            <li key={bill.id}>
              <Link
                href={`/bills/${bill.id}/create-video`}
                style={{
                  color:
                    router.asPath === `/bills/${bill.id}/create-video`
                      ? "magenta"
                      : "#ffffff",
                }}
              >
                {bill.description}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      <div style={container}>
        <Player
          component={LegislationVideo}
          inputProps={{
            billResult: billResult,
            summaryScenesCount: summaryScenesCount,
            summary: summary,
          }}
          durationInFrames={
            (totalInnerScenesCount - summaryScenesCount + 2) *
              SCENE_LENGTH_IN_FRAMES +
            summaryScenesCount * SUMMARY_SCENE_LENGTH_IN_FRAMES // Calculates total frames based on the number of innerScenes, summaryScenes, and their respective lengths
          }
          fps={VIDEO_FPS}
          compositionHeight={VIDEO_HEIGHT}
          compositionWidth={VIDEO_WIDTH}
          style={player}
          controls
          autoPlay
          loop
        />
        <RenderControls
          text={text}
          setText={setText}
          inputProps={inputProps}
        ></RenderControls>
        <Spacing></Spacing>
        <Spacing></Spacing>
        <Spacing></Spacing>
        <Spacing></Spacing>
      </div>
    </div>
  );
};

export default CreateVideoPage;
