import { ReactNode } from "react";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import nextI18nextConfig from "next-i18next.config";
import { useTranslation } from "next-i18next";

import { BasicLayout, HomePageButton } from "components";
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
        href={userLoggedIn ? "/voting-guides" : "/login?next=voting-guides"}
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
  const { user } = useAuth();

  return (
    <BasicLayout>
      <CitizenHome userLoggedIn={!!user} />
    </BasicLayout>
  );
}

HomePage.getLayout = (page: ReactNode) => {
  return page;
};

export default HomePage;
