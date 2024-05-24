import { Composition } from "remotion";
import { LegislationVideo } from "./Video";
import "../../styles/main.scss";
// import { Bill, BillStatus, State } from "generated";
// import type { BillResult, PoliticianResult } from "generated";
// import { calculateScenes } from "../../utils/calculateScenes";
// import { useBillBySlugQuery } from "generated";

import {
  // SCENE_LENGTH_IN_FRAMES,
  // SUMMARY_SCENE_LENGTH_IN_FRAMES,
  defaultMyCompProps,
  VIDEO_WIDTH,
  VIDEO_HEIGHT,
  VIDEO_FPS,
} from "../../types/constants";

// type PartialBill = Partial<Bill> & {
//   id: string;
//   slug: string;
//   title: string;
//   billNumber: string;
//   status: BillStatus;
//   state: State;
// };

export const RemotionRoot: React.FC = () => {
  // const { data } = useBillBySlugQuery({
  //   slug: slug as string,
  // });

  // const billResult = data.billBySlug as BillResult;
  // const sponsors = billResult?.sponsors as PoliticianResult[];

  // const summary =
  //   billResult?.populistSummary ||
  //   billResult?.description ||
  //   billResult?.officialSummary ||
  //   null;

  // const { totalInnerScenesCount, summaryScenesCount } = calculateScenes(
  //   summary,
  //   billResult.legiscanData,
  //   sponsors
  // );
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
