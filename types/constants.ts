import { BillResult } from "generated";

export const COMP_NAME = "LegislationVideo";

export type CompositionProps = {
  billResult: BillResult | null;
  summaryScenesCount: number;
  summary: string;
};

export const defaultMyCompProps: CompositionProps = {
  billResult: null,
  summaryScenesCount: 3,
  summary:
    "This bill in Minnesota expands housing protections by prohibiting discrimination based on various factors and banning landlords from requiring pet declawing or devocalization. It also mandates disclosure of all nonoptional fees in lease agreements, implements inspections to prevent security deposit disputes, and provides public housing tenants facing eviction with a right to court-appointed counsel. Additionally, the bill amends statutes concerning lease covenants, tenant removal processes, emergency relief petitions, and eviction procedures, with an effective date of January 1, 2024, for these provisions.",
};

export const DURATION_IN_FRAMES = 200;
export const VIDEO_WIDTH = 1080;
export const VIDEO_HEIGHT = 1920;
export const VIDEO_FPS = 60;
export const SCENE_LENGTH_IN_FRAMES = 4 * VIDEO_FPS; // 4 seconds
export const SUMMARY_SCENE_LENGTH_IN_FRAMES = 5 * VIDEO_FPS; // 5 seconds, more comfortable reading length
