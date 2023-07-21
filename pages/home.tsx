import { ReactNode, useState } from "react";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import nextI18nextConfig from "next-i18next.config";
import { useTranslation } from "next-i18next";

import { BasicLayout, HomePageButton, BetaNotice } from "components";
import { BETA_NOTICE_VISIBLE } from "utils/constants";
import { useAuth } from "hooks/useAuth";
import { SupportedLocale } from "types/global";

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

function CitizenHome({ userLoggedIn }: { userLoggedIn: boolean }) {
  const { t } = useTranslation("common");
  return (
    <div>
      <HomePageButton
        href={userLoggedIn ? "/ballot" : "/ballot/choose"}
        className="myBallot"
        label={t("my-ballot")}
      />
      <HomePageButton
        href={userLoggedIn ? "/voting-guides" : "/login?next=/voting-guides"}
        className="votingGuides"
        label={t("voting-guides")}
      />
      <HomePageButton
        href="/politicians"
        className="myLegislators"
        label={t("politicians")}
      />
      <HomePageButton
        href="/bills"
        className="legislation"
        label={t("legislation")}
      />
    </div>
  );
}

function HomePage() {
  const { user } = useAuth({ redirect: false });
  const userId = user?.id;

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
    <BasicLayout>
      <BetaNotice onContinue={handleBetaDismissal} />
    </BasicLayout>
  ) : (
    <BasicLayout>
      <CitizenHome userLoggedIn={!!user} />
    </BasicLayout>
  );
}

HomePage.getLayout = (page: ReactNode) => {
  return page;
};

export default HomePage;
