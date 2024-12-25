// pages/docs/api/schema/[category].tsx
import { GetServerSideProps } from "next";
import { notFound } from "next/navigation";
import queries from "generated/schema/queries.json";
import mutations from "generated/schema/mutations.json";
import types from "generated/schema/types.json";
import { TypesDoc } from "components/TypesDoc/TypesDoc";
import { DocsLayout } from "components";
import { ApiDoc } from "components/ApiDoc/ApiDoc";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { SupportedLocale } from "types/global";
import nextI18nextConfig from "next-i18next.config";

interface Props {
  category: string;
}

export default function SchemaDocsPage({ category }: Props) {
  let content;
  switch (category) {
    case "queries":
      content = <ApiDoc items={queries} title="Queries" type="query" />;
      break;
    case "mutations":
      content = <ApiDoc items={mutations} title="Mutations" type="mutation" />;
      break;
    case "types":
      content = <TypesDoc types={types} />;
      break;
    default:
      return notFound();
  }

  return <DocsLayout currentPage="api">{content}</DocsLayout>;
}

export const getServerSideProps: GetServerSideProps = async ({
  params,
  locale,
}) => {
  const category = params?.category as string;

  if (!category || !["queries", "mutations", "types"].includes(category)) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      category,
      title: "Populist Conversations",
      description:
        "Join the conversation on the latest political topics and bills.",
      ...(await serverSideTranslations(
        locale as SupportedLocale,
        ["auth", "common"],
        nextI18nextConfig
      )),
    },
  };
};
