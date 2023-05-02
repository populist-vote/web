import { i18n } from "next-i18next.config";
export const DEFAULT_LANGUAGE = i18n.defaultLocale;
export type Language = typeof i18n.locales[number];

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
  { code: "es", display: "Spanish" },
  { code: "so", display: "Somali" },
  { code: "hmn", display: "Hmong" },
];

// Urls

export const PERSON_FALLBACK_IMAGE_URL =
  "https://populist-platform.s3.us-east-2.amazonaws.com/web-assets/politician-thumbnails/default-person-160.jpg";

export const PERSON_FALLBACK_IMAGE_400_URL =
  "https://populist-platform.s3.us-east-2.amazonaws.com/web-assets/politician-thumbnails/default-person-400.jpg";

export const ORGANIZATION_FALLBACK_IMAGE_URL =
  "https://populist-platform.s3.us-east-2.amazonaws.com/web-assets/organization-thumbnails/default-org-160.jpg";

export const ORGANIZATION_FALLBACK_IMAGE_400_URL =
  "https://populist-platform.s3.us-east-2.amazonaws.com/web-assets/organization-thumbnails/default-org-400.jpg";

// Local Storage
export const VOTING_GUIDE_WELCOME_VISIBLE =
  "populist-voting-guide-welcome-visible";
export const SAVED_GUIDES_LOCAL_STORAGE = "populist-saved-guides-local-storage";
export const BETA_NOTICE_VISIBLE = "populist-beta-notice-visible";
export const LAST_SELECTED_EMBED_TYPE = "last-selected-embed-type";

// Session Storage
export const SELECTED_ELECTION = "populist-selected-election";
