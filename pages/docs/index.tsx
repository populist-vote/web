import { Box, Divider, DocsLayout } from "components";
import { GetServerSideProps } from "next";
import nextI18nextConfig from "next-i18next.config";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { ReactNode } from "react";
import { SupportedLocale } from "types/global";

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { locale } = ctx;
  return {
    props: {
      title: "Populist Conversations",
      description:
        "Join the conversation on the latest political topics and bills.",
      ...ctx.query,
      ...(await serverSideTranslations(
        locale as SupportedLocale,
        ["auth", "common"],
        nextI18nextConfig
      )),
    },
  };
};

export default function DocsIndex() {
  return (
    <div>
      <h1>
        Populist{" "}
        <span
          style={{
            textTransform: "uppercase",
            color: "var(--aqua)",
            fontSize: "1.5rem",
            fontWeight: 600,
          }}
        >
          docs
        </span>
      </h1>
      <Divider />

      <Box>
        <h2>Getting Started</h2>
        <p>
          Welcome to the Populist documentation! Here you'll find everything you
          need to get started with the Populist platform.
        </p>
      </Box>
    </div>
  );
}

DocsIndex.getLayout = (page: ReactNode) => (
  <DocsLayout hideAside currentPage="home">
    {page}
  </DocsLayout>
);
