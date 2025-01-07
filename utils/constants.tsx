import type { i18n } from "../next-i18next.config";
// export const DEFAULT_LANGUAGE = i18n.defaultLocale;
export const DEFAULT_LANGUAGE = "en";
export type Language = (typeof i18n.locales)[number];
import { loadEnvConfig } from "@next/env";

const projectDir = process.cwd();
loadEnvConfig(projectDir);

export interface LocalizedNote {
  en?: string;
  es?: string;
  so?: string;
  hmn?: string;
}

export interface LanguageCode {
  code: Language;
  display: string;
}

export const LANGUAGES: LanguageCode[] = [
  { code: "en", display: "English" },
  { code: "es", display: "Español" },
  { code: "so", display: "Soomaali" },
  { code: "hmn", display: "Hmoob" },
];

// Urls
export const PERSON_FALLBACK_IMAGE_URL =
  "https://populist-platform.s3.us-east-2.amazonaws.com/web-assets/politician-thumbnails/default-person-160.jpg";

export const PERSON_FALLBACK_IMAGE_400_URL =
  "https://populist-platform.s3.us-east-2.amazonaws.com/web-assets/politician-thumbnails/default-person-400.jpg";

export const PERSON_FALLBACK_IMAGE_LIGHT_URL =
  "https://populist-platform.s3.us-east-2.amazonaws.com/web-assets/politician-thumbnails/default-person-light-160.jpg";

export const PERSON_FALLBACK_IMAGE_LIGHT_400_URL =
  "https://populist-platform.s3.us-east-2.amazonaws.com/web-assets/politician-thumbnails/default-person-light-400.jpg";

export const ORGANIZATION_FALLBACK_IMAGE_URL =
  "https://populist-platform.s3.us-east-2.amazonaws.com/web-assets/organization-thumbnails/default-org-160.jpg";

export const ORGANIZATION_FALLBACK_IMAGE_400_URL =
  "https://populist-platform.s3.us-east-2.amazonaws.com/web-assets/organization-thumbnails/default-org-400.jpg";

// Local Storage
export const VOTING_GUIDE_WELCOME_VISIBLE =
  "populist-voting-guide-welcome-visible";
export const SAVED_GUIDES_LOCAL_STORAGE = "populist-saved-guides-local-storage";
export const LAST_SELECTED_EMBED_TYPE = "last-selected-embed-type";

// Session Storage
export const SELECTED_ELECTION = "populist-selected-election";

export const FEATURES = {
  VIDEO_GENERATION: "video-generation",
};

export const EMBED_CONTENT_IDS = {
  staging: {
    "candidate-guide": {
      embedId: "6db3cbcd-4030-477b-80f1-6496a93d6e4d",
      candidateGuideId: "71fafeab-69b0-4c5b-b676-1d479b1ae5fa",
    },
    "legislation-tracker": {
      embedId: "f75c87ef-2e23-4db3-be1f-70f121cc38e3",
      billIds: [
        "c86a2481-0785-4452-aae3-06a2494b65d6",
        "628f77a1-c784-4312-8836-5734ef035a04",
        "d2875a63-10a7-4d21-b10c-b5174307cced",
      ],
    },
    legislation: {
      embedId: "4c6c4668-0ee5-43c4-9314-237f54984107",
      billId: "504d04d8-b55a-4bda-8e18-6ee89899a511",
    },
    politician: {
      embedId: "44805e68-d274-482e-876d-fca5a399e7bb",
      politicianId: "c686d275-f13b-485e-9a53-06c94eee2389",
    },
    poll: {
      embedId: "2ec3f7fa-219e-48a4-83a2-0a8f57613c65",
    },
    question: {
      embedId: "51e58ff4-2df6-4faf-942c-ec48ee1e19fc",
      questionId: "b6df5512-ced1-4fff-8f5e-8f2e877b0986",
    },
    race: {
      embedId: "a0ed996e-7986-474b-9325-477ad3cf5f6a",
      raceId: "e08adfe5-8602-471e-804f-446dc985af23",
    },
  },
  production: {
    "candidate-guide": {
      embedId: "b2f081de-dc1a-459e-b78f-da24bab97ca5",
      candidateGuideId: "5e9792f9-e811-43d9-85eb-f21d6a08833d",
    },
    "legislation-tracker": {
      embedId: "1234",
      billIds: [],
    },
    legislation: {},
    politician: {
      embedId: "aa09ec05-a370-46af-aa95-5dfc12dc8b72",
      politicianId: "40170687-df47-4ad3-87a4-93096a2fb128",
    },
    poll: {
      embedId: "2ec3f7fa-219e-48a4-83a2-0a8f57613c65",
      pollId: "3e2f05e2-cd6a-4e30-a9f5-659e18028f6b",
    },
    question: {
      embedId: "51e58ff4-2df6-4faf-942c-ec48ee1e19fc",
      questionId: "b6df5512-ced1-4fff-8f5e-8f2e877b0986",
    },
  },
};

export const getEmbedConfig = ():
  | (typeof EMBED_CONTENT_IDS)["staging"]
  | (typeof EMBED_CONTENT_IDS)["production"] => {
  const environment =
    (process.env.NEXT_PUBLIC_ENV as keyof typeof EMBED_CONTENT_IDS) ||
    "staging";
  return EMBED_CONTENT_IDS[environment];
};
