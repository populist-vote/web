import { Player } from "@remotion/player";
import type { NextPage } from "next";
import { useRouter } from "next/router";
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
        <ul>
          <li>
            <Link
              href={`/bills/mnhf1002023-2024/create-video`}
              style={{ color: "#ffffff" }}
            >
              no summary, h&s votes, lots of d sponsors
            </Link>
          </li>
          <li>
            <Link
              href={`/bills/mnsf18842023-2024/create-video`}
              style={{ color: "#ffffff" }}
            >
              no summary, no votes, 3 dem sponsors
            </Link>
          </li>
          <li>
            <Link
              href={`/bills/us-hb2772-2023-2024/create-video`}
              style={{ color: "#ffffff" }}
            >
              2 issue tags, summary, no votes, no sponsors
            </Link>
          </li>
        </ul>
      </div>

      <div style={container}>
        <div>
          <Player
            component={LegislationVideo}
            inputProps={{ billResult: data.billBySlug as BillResult }}
            durationInFrames={1000}
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
