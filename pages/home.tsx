import { ReactNode, useState } from "react";
import { BasicLayout, HomePageButton, BetaNotice } from "components";
import { BETA_NOTICE_VISIBLE } from "utils/constants";
import { useAuth } from "hooks/useAuth";
import { SupportedLocale } from "types/global";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import nextI18nextConfig from "next-i18next.config";
import { useTranslation } from "next-i18next";
import { Role } from "generated";

export async function getServerSideProps({
  locale,
}: {
  locale: SupportedLocale;
}) {
  return {
    props: {
      title: "Home",
      ...(await serverSideTranslations(
        locale,
        ["auth", "common"],
        nextI18nextConfig
      )),
    },
  };
}

function HomePage() {
  const { user } = useAuth({ redirect: false });
  const userId = user?.id;
  const { t } = useTranslation("common");

  const [isBetaVisible, setIsBetaVisible] = useState(
    localStorage.getItem(`${BETA_NOTICE_VISIBLE}-${userId || "incognito"}`) !==
      "false"
  );

  const handleBetaDismissal = () => {
    setIsBetaVisible(false);
    localStorage.setItem(
      `${BETA_NOTICE_VISIBLE}-${userId || "incognito"}`,
      "false"
    );
  };

  return isBetaVisible ? (
    <BetaNotice onContinue={handleBetaDismissal} />
  ) : (
    <div>
      <HomePageButton
        href={user ? "/ballot" : "/ballot/choose"}
        className="myBallot"
        label={t("my-ballot")}
      />
      <HomePageButton
        href={user ? "/voting-guides" : "/login?next=/voting-guides"}
        className="votingGuides"
        label={t("voting-guides")}
      />
      <HomePageButton
        href="/politicians"
        className="myLegislators"
        label={t("browse-politicians")}
      />
      <HomePageButton
        href="/bills"
        className="legislation"
        label={t("legislation")}
      />
      {user?.role === Role.Superuser && (
        <HomePageButton href="/admin" className="admin" label={"Admin"} />
      )}
    </div>
  );
}

HomePage.getLayout = (page: ReactNode) => (
  <BasicLayout showAuthButtons>{page}</BasicLayout>
);

export default HomePage;
