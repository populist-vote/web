import { BillResult } from "generated";

export const COMP_NAME = "LegislationVideo";

export type CompositionProps = {
  billResult: BillResult | null;
  summaryScenesCount: number;
};

export const defaultMyCompProps: CompositionProps = {
  billResult: null,
  summaryScenesCount: 3,
};

export const DURATION_IN_FRAMES = 200;
export const VIDEO_WIDTH = 1080;
export const VIDEO_HEIGHT = 1920;
export const VIDEO_FPS = 60;
export const SCENE_LENGTH_IN_FRAMES = 4 * VIDEO_FPS; // 4 seconds
export const SUMMARY_SCENE_LENGTH_IN_FRAMES = 5 * VIDEO_FPS; // 5 seconds, more comfortable reading length
