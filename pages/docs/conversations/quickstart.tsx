import { GetServerSideProps } from "next";
import nextI18nextConfig from "next-i18next.config";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { ReactNode } from "react";
import { SupportedLocale } from "types/global";
import DocsLayout from "../DocsLayout/DocsLayout";
import useOrganizationStore from "hooks/useOrganizationStore";
import { useOrganizationByIdQuery } from "generated";
import Link from "next/link";

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

export default function DocsConversationsQuickstart() {
  const { organizationId } = useOrganizationStore();
  const { data: organizationData } = useOrganizationByIdQuery({
    id: organizationId as string,
  });
  const dashboardSlug = organizationData?.organizationById?.slug;
  return (
    <div>
      <h2>Quickstart</h2>
      <p>
        <ol
          style={{
            listStyleType: "decimal",
            paddingLeft: "20px",
          }}
        >
          <li style={{ marginBottom: "10px" }}>
            Access the conversations feature by navigating to conversations on
            your{" "}
            <Link
              href={`/dashboard/${dashboardSlug}/conversations`}
              style={{
                color: "var(--blue-text)",
                textDecoration: "dotted underline",
              }}
            >
              organization's dashboard.
            </Link>
          </li>
          <li style={{ marginBottom: "10px" }}>
            Click the "Create New Conversation" button to create a new
            conversation.
          </li>
          <li style={{ marginBottom: "10px" }}>
            Set a topic and optional description for the conversation.
          </li>
          <li style={{ marginBottom: "10px" }}>
            Optionally add seed statements to provide initial context or ideas
            for the discussion.
          </li>
          <li style={{ marginBottom: "10px" }}>
            Click on "Manage" then "Copy Public URL" to distribute a link to the
            conversation
          </li>
          <li style={{ marginBottom: "10px" }}>
            From the "Manage" tab you'll be able to monitor the conversation in
            realtime.
          </li>
          <li style={{ marginBottom: "10px" }}>
            Use the "Moderate" tab to manage comments and seed statements.
          </li>
        </ol>
      </p>
    </div>
  );
}

DocsConversationsQuickstart.getLayout = (page: ReactNode) => (
  <DocsLayout currentPage="conversations">{page}</DocsLayout>
);
