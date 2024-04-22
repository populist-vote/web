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
  padding: 10,
  backgroundColor: "var(--blue-darker)",
};

const player: React.CSSProperties = {
  width: "50%",
};

const Home: NextPage = () => {
  // const billId = "mnsf18842023-2024"; // 3sponsors
  // const billId = "mnsf7222023-2024"; // 3 republican sponsors
  // const billId = "us-hb2772-2023-2024"; // 2 issue tags
  const billId = "us-hb610-2023-2024"; // 1 issue tags
  // const billId = "mnhf29252023-2024"; // 10 democratic sponsors
  const { data, isLoading, error } = useBillBySlugQuery({ slug: billId });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.toString()}</div>;
  if (!data?.billBySlug) return null;

  return (
    <div>
      <h1>Create a Video</h1>

      <div style={container}>
        <div>
          <Player
            component={LegislationVideo}
            inputProps={{ billResult: data.billBySlug as BillResult }}
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
    </div>
  );
};

export default Home;
