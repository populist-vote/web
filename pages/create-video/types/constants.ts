import { z } from "zod";
export const COMP_NAME = "MyComp";

export const CompositionProps = z.object({
  title: z.string(),
  billTitle: z.string(), // Add the billTitle property
});

export const defaultMyCompProps: z.infer<typeof CompositionProps> = {
  title: "Enter your title here",
  billTitle: "Enter your bill title here", // Add a default value for billTitle
};

export const DURATION_IN_FRAMES = 200;
export const VIDEO_WIDTH = 1280;
export const VIDEO_HEIGHT = 720;
export const VIDEO_FPS = 30;
