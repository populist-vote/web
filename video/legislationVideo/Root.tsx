import { Composition } from "remotion";
import { LegislationVideo } from "./Video";
import "../../styles/main.scss";
import { calculateScenes } from "../../utils/calculateScenes";

import {
  defaultMyCompProps,
  SCENE_LENGTH_IN_FRAMES,
  SUMMARY_SCENE_LENGTH_IN_FRAMES,
  VIDEO_WIDTH,
  VIDEO_HEIGHT,
  VIDEO_FPS,
} from "../../types/constants";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="LegislationVideo"
        component={LegislationVideo}
        durationInFrames={2400}
        fps={VIDEO_FPS}
        width={VIDEO_WIDTH}
        height={VIDEO_HEIGHT}
        defaultProps={defaultMyCompProps}
        calculateMetadata={async ({ props }) => {
          const { billResult } = props;
          if (!billResult) {
            throw new Error("billResult is null");
          }
          const { totalInnerScenesCount, summaryScenesCount } =
            calculateScenes(billResult);
          const durationInFrames =
            (totalInnerScenesCount - summaryScenesCount + 2) *
              SCENE_LENGTH_IN_FRAMES +
            summaryScenesCount * SUMMARY_SCENE_LENGTH_IN_FRAMES;

          return {
            durationInFrames,
          };
        }}
      />
    </>
  );
};
