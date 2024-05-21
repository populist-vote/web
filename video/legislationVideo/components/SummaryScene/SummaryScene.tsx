import React from "react";
import { Animated, Move, Fade } from "remotion-animated";
import { SUMMARY_SCENE_LENGTH_IN_FRAMES } from "../../../../types/constants";

interface SummarySceneProps {
  summary: string | undefined;
}

const SummaryScene: React.FC<SummarySceneProps> = ({ summary }) => {
  if (!summary) {
    return null;
  }

  // Split the summary into sentences
  const sentences = summary.match(/[^\.!\?]+[\.!\?]+/g) || [];
  const parts = [];
  let currentPart = "";

  sentences.forEach((sentence) => {
    if ((currentPart + sentence).split(" ").length > 30) {
      parts.push(currentPart.trim());
      currentPart = sentence;
    } else {
      currentPart += " " + sentence;
    }
  });

  // Add the last part if it exists
  if (currentPart) {
    parts.push(currentPart.trim());
  }

  let startFrame = 0;

  return (
    <div style={{ height: "800px" }}>
      {parts.map((part, index) => {
        startFrame = index * SUMMARY_SCENE_LENGTH_IN_FRAMES;
        const animations = [
          Move({ start: startFrame, x: 0, initialX: -30 }),
          Fade({ start: startFrame, to: 1, initial: 0, duration: 30 }),
        ];

        // Conditionally add exit animations unless it's the last part or there's only one part
        if (parts.length > 1 && index !== parts.length - 1) {
          animations.push(
            Move({
              start: startFrame + SUMMARY_SCENE_LENGTH_IN_FRAMES - 30,
              x: 30,
            }),
            Fade({
              start: startFrame + SUMMARY_SCENE_LENGTH_IN_FRAMES - 30,
              to: 0,
              initial: 1,
              duration: 20,
            })
          );
        }

        return (
          <Animated
            key={index}
            in={startFrame}
            out={startFrame + SUMMARY_SCENE_LENGTH_IN_FRAMES}
            animations={animations}
            style={{ opacity: 0 }}
          >
            <p>{part}</p>
          </Animated>
        );
      })}
    </div>
  );
};

export default SummaryScene;
