import { Player } from "@remotion/player";
import type { NextPage } from "next";
import Head from "next/head";
import React, { useMemo, useState } from "react";
import { Main } from "./remotion/MyComp/Main";
import {
  CompositionProps,
  defaultMyCompProps,
  DURATION_IN_FRAMES,
  VIDEO_FPS,
  VIDEO_HEIGHT,
  VIDEO_WIDTH,
} from "./types/constants";
import { z } from "zod";
import { Spacing } from "./components/Spacing";
import { useBillBySlugQuery } from "generated";

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
  width: "100%",
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
    <div>
      <Head>
        <title>us-hb610-2023-2024</title>
        <meta name="description" content="us-hb610-2023-2024" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div style={container}>
        <h1 id="billTitle">{bill.populistTitle ?? bill.title}</h1>
        <div className="cinematics" style={outer}>
          <Player
            component={Main}
            inputProps={inputProps}
            durationInFrames={DURATION_IN_FRAMES}
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
    </div>
  );
};

export default Home;