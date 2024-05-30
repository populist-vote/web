import { Composition } from "remotion";
import { LegislationVideo } from "./Video";
import "../../styles/main.scss";

import {
  defaultMyCompProps,
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
      />
    </>
  );
};
