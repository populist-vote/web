import { Divider } from "components";

import { GetServerSideProps } from "next";
import nextI18nextConfig from "next-i18next.config";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { ReactNode } from "react";
import { SupportedLocale } from "types/global";
import DocsLayout from "../DocsLayout/DocsLayout";

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

export default function DocsApiAuth() {
  return (
    <div>
      <h2>API Reference</h2>
      <Divider />
      <h3>Authentication</h3>
      <p>
        The Populist public API requires an `authorization` header to be set
        with your request using your API key like so:
        <pre>
          <code>"authorization": "Bearer YOUR_API_KEY"</code>
        </pre>
      </p>
      <p>
        If you do not have an API key, you can request one by contacting us at{" "}
        <a href="mailto:info@populist.us">info@populist.us</a>.
      </p>
    </div>
  );
}

DocsApiAuth.getLayout = (page: ReactNode) => (
  <DocsLayout currentPage="api">{page}</DocsLayout>
);
