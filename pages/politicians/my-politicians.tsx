import { Layout } from "components";
import { GetServerSideProps } from "next";
import nextI18nextConfig from "next-i18next.config";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { ReactNode } from "react";
import { SupportedLocale } from "types/global";
import styles from "./MyPoliticians.module.scss";
import clsx from "clsx";
import { PoliticiansTopNav } from ".";

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { locale } = ctx;
  return {
    props: {
      title: "Politician Browser",
      description:
        "Find information on your government representatives like voting histories, endorsements, and financial data.",
      ...ctx.query,
      ...(await serverSideTranslations(
        locale as SupportedLocale,
        ["auth", "common"],
        nextI18nextConfig
      )),
    },
  };
};

export default function MyPoliticians() {
  return (
    <div>
      <PoliticiansTopNav />
      <div
        className={clsx(styles.centered, styles.noResults)}
        style={{ height: "80vh" }}
      >
        Coming soon...
      </div>
    </div>
  );
}

MyPoliticians.getLayout = (page: ReactNode) => <Layout>{page}</Layout>;
