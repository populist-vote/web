import { Player } from "@remotion/player";
import type { NextPage } from "next";
import React, { useMemo, useState } from "react";
import { RemotionVideo } from "./remotion/Video";
import {
  CompositionProps,
  defaultMyCompProps,
  // DURATION_IN_FRAMES,
  VIDEO_FPS,
  VIDEO_HEIGHT,
  VIDEO_WIDTH,
} from "./types/constants";
import { z } from "zod";
import { Spacing } from "./components/Spacing";
import { useBillBySlugQuery } from "generated";
// import "load-fonts";

const container: React.CSSProperties = {
  maxWidth: 768,
  margin: "auto",
  marginBottom: 20,
};

const outer: React.CSSProperties = {
  borderRadius: "var(--geist-border-radius)",
  overflow: "hidden",
  boxShadow: "0 0 200px rgba(0, 0, 0, 0.15)",
  marginBottom: 40,
  marginTop: 60,
};

const player: React.CSSProperties = {
  width: "50%",
};

const Home: NextPage = () => {
  const billId = "us-hb610-2023-2024";
  const { data, isLoading, error } = useBillBySlugQuery({ slug: billId });

  const [text] = useState<string>(defaultMyCompProps.title);
  const inputProps: z.infer<typeof CompositionProps> = useMemo(() => {
    return {
      title: text,
      billTitle:
        data?.billBySlug?.populistTitle ?? data?.billBySlug?.title ?? "",
    };
  }, [text, data]);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.toString()}</div>;
  if (!data?.billBySlug) return null;

  const bill = data.billBySlug;

  return (
    <div style={container}>
      <h1>Create a Video</h1>
      <h2 id="billTitle">{bill.populistTitle ?? bill.title}</h2>

      <div className="cinematics" style={outer}>
        <Player
          component={RemotionVideo}
          inputProps={inputProps}
          durationInFrames={600}
          fps={VIDEO_FPS}
          compositionHeight={VIDEO_HEIGHT}
          compositionWidth={VIDEO_WIDTH}
          style={player}
          controls
          autoPlay
          loop
        />
      </div>
      <Spacing></Spacing>
      <Spacing></Spacing>
      <Spacing></Spacing>
      <Spacing></Spacing>
    </div>
  );
};

export default Home;
