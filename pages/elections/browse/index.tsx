import { Layout, TopNavElections } from "components";
import { USMap } from "components/USMap/USMap";
import nextI18nextConfig from "next-i18next.config";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useRouter } from "next/router";
import { ReactNode } from "react";
import { SupportedLocale } from "types/global";

export async function getServerSideProps({
  locale,
}: {
  locale: SupportedLocale;
}) {
  return {
    props: {
      mobileNavTitle: "Elections",
      title: "Elections",
      description:
        "Browse upcoming elections, find your polling place, and learn about the candidates and issues on your ballot.",
      ...(await serverSideTranslations(
        locale,
        ["auth", "common"],
        nextI18nextConfig
      )),
    },
  };
}

export default function ElectionBrowser() {
  const router = useRouter();
  return (
    <USMap
      handleStateClick={(state) =>
        router.push(
          `/elections/browse/${state}?year=${new Date().getFullYear()}`
        )
      }
    ></USMap>
  );
}

ElectionBrowser.getLayout = (page: ReactNode) => (
  <Layout mobileNavTitle={"Elections"} showNavLogoOnMobile>
    <TopNavElections selected="Browse" showElectionSelector />
    {page}
  </Layout>
);
