import { Player } from "@remotion/player";
import type { NextPage } from "next";
import { LegislationVideo } from "../../video/legislationVideo/Video";
import { VIDEO_FPS, VIDEO_HEIGHT, VIDEO_WIDTH } from "types/constants";
import type { BillResult } from "generated";

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
  width: "50%",
};

const Home: NextPage = () => {
  const billId = "mnsf18842023-2024";
  const { data, isLoading, error } = useBillBySlugQuery({ slug: billId });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.toString()}</div>;
  if (!data?.billBySlug) return null;

  return (
    <div style={container}>
      <h1>Create a Video</h1>
      <div className="cinematics" style={outer}>
        <Player
          component={LegislationVideo}
          inputProps={{ billData: data.billBySlug as BillResult }}
          durationInFrames={800}
          fps={VIDEO_FPS}
          compositionHeight={VIDEO_HEIGHT}
          compositionWidth={VIDEO_WIDTH}
          style={player}
          controls
          autoPlay
          loop
        />
      </div>
    </div>
  );
};

export default Home;
