import type { i18n } from "../next-i18next.config";
// export const DEFAULT_LANGUAGE = i18n.defaultLocale;
export const DEFAULT_LANGUAGE = "en";
export type Language = (typeof i18n.locales)[number];

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
  development: {
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
      embedId: "6de0123b-f69a-4548-bf4d-d31e3e14cc09",
      pollId: "c79c80d1-cb49-4003-9b34-9ccfca4867a6",
    },
    question: {
      embedId: "6f5c8cc2-58fd-4aaf-9297-bb3577748e4f",
      questionId: "2ad89ab9-92b8-4593-91fa-875fec0028e1",
    },
  },
  staging: {
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
      embedId: "6de0123b-f69a-4548-bf4d-d31e3e14cc09",
      pollId: "c79c80d1-cb49-4003-9b34-9ccfca4867a6",
    },
    question: {
      embedId: "6f5c8cc2-58fd-4aaf-9297-bb3577748e4f",
      questionId: "2ad89ab9-92b8-4593-91fa-875fec0028e1",
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
      embedId: "6de0123b-f69a-4548-bf4d-d31e3e14cc09",
      pollId: "c79c80d1-cb49-4003-9b34-9ccfca4867a6",
    },
    question: {
      embedId: "6f5c8cc2-58fd-4aaf-9297-bb3577748e4f",
      questionId: "2ad89ab9-92b8-4593-91fa-875fec0028e1",
    },
  },
};

export const getEmbedConfig = ():
  | (typeof EMBED_CONTENT_IDS)["staging"]
  | (typeof EMBED_CONTENT_IDS)["production"] => {
  const environment =
    (process.env.ENV as keyof typeof EMBED_CONTENT_IDS) || "staging";
  return EMBED_CONTENT_IDS[environment];
};
