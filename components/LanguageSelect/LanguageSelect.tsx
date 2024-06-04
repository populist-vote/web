import { Select } from "components/Select/Select";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import { LANGUAGES } from "utils/constants";

export function LanguageSelect() {
  const { i18n } = useTranslation();
  const router = useRouter();
  return (
    <Select
      textColor="grey-darkest"
      backgroundColor={"grey-light"}
      onChange={(e) => {
        void i18n.changeLanguage(e.target.value);
        void router.push(router.asPath, router.asPath, {
          locale: e.target.value,
          scroll: false,
        });
      }}
      value={i18n.language}
      options={LANGUAGES.map((l) => ({
        value: l.code,
        label: l.display,
      }))}
    />
  );
}
