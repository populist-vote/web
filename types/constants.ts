import { z } from "zod";

export const CompositionProps = z.object({
  title: z.string(),
  billTitle: z.string(), // Add the billTitle property
});

export const DURATION_IN_FRAMES = 200;
export const VIDEO_WIDTH = 1080;
export const VIDEO_HEIGHT = 1920;
export const VIDEO_FPS = 60;
export const SCENE_LENGTH_IN_FRAMES = 4 * VIDEO_FPS; // 4 seconds
