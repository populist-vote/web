import { Select } from "components/Select/Select";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import { LanguageCode, LANGUAGES } from "utils/constants";

export function LanguageSelect({ languages }: { languages?: LanguageCode[] }) {
  const { i18n } = useTranslation();
  const router = useRouter();
  return (
    <Select
      textColor="grey-darkest"
      backgroundColor={"grey-lighter"}
      border="solid"
      borderColor="grey-light"
      onChange={(e) => {
        void i18n.changeLanguage(e.target.value);
        void router.push(router.asPath, router.asPath, {
          locale: e.target.value,
          scroll: false,
        });
      }}
      value={i18n.language}
      options={(languages || LANGUAGES).map((l) => ({
        value: l.code,
        label: l.display,
      }))}
    />
  );
}
