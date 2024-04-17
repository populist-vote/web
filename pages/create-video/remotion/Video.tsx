import { Composition } from "remotion";
import { Main } from "./MyComp/Main";

export const RemotionVideo: React.FC = () => {
  return (
    <>
      <Composition
        id={"Main"}
        component={Main}
        durationInFrames={200}
        fps={60}
        width={1080}
        height={1920}
      />
    </>
  );
};
