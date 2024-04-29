import { Player } from "@remotion/player";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import { useState } from "react";
import { LegislationVideo } from "../../../video/legislationVideo/Video";
import { VIDEO_FPS, VIDEO_HEIGHT, VIDEO_WIDTH } from "types/constants";
import type { BillResult } from "generated";
import { useBillBySlugQuery } from "generated";
import Link from "next/link";

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
  const router = useRouter();
  const { slug } = router.query;
  const { data, isLoading, error } = useBillBySlugQuery({
    slug: slug as string,
  });

  const [innerFrames, setInnerFrames] = useState(0);

  const handleFrameCount = (frameCount: number) => {
    setInnerFrames(frameCount);
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.toString()}</div>;
  if (!data?.billBySlug) return null;

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
        <p>Number of Inner Sequence Frames: {innerFrames}</p>

        <ul>
          {[
            {
              id: "mnhf1002023-2024",
              description: "no summary, h&s votes, lots of d sponsors",
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
              id: "mnhf9172023-2024",
              description: "3-6 sponsors",
            },
            {
              id: "mnhf14402023-2024",
              description: "multi sentence summary",
            },
            {
              id: "mnhf9172023-2024",
              description: "only house vote",
            },
            {
              id: "mnhf1732023-2024",
              description: "33 sponsors",
            },
          ].map((bill) => (
            <li key={bill.id}>
              <Link
                href={`/bills/${bill.id}/create-video`}
                style={{ color: "#ffffff" }}
              >
                {bill.description}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      <div style={container}>
        <div>
          <Player
            component={LegislationVideo}
            inputProps={{
              billResult: data.billBySlug as BillResult,
              onFrameCount: handleFrameCount,
            }}
            durationInFrames={2000}
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

export default CreateVideoPage;
