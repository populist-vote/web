// pages/docs/api/schema/[category].tsx
import { GetServerSideProps } from "next";
import { notFound } from "next/navigation";
import queries from "generated/schema/queries.json";
import mutations from "generated/schema/mutations.json";
import types from "generated/schema/types.json";
import { QueriesDoc } from "components/QueriesDoc/QueriesDoc";
import { TypesDoc } from "components/TypesDoc/TypesDoc";
import { DocsLayout } from "components";
import { MutationsDoc } from "components/MutationsDoc/MutationsDoc";

interface Props {
  category: string;
}

export default function SchemaDocsPage({ category }: Props) {
  console.log("Category prop:", category);

  let content;
  switch (category) {
    case "queries":
      content = <QueriesDoc queries={queries} />;
      break;
    case "mutations":
      content = <MutationsDoc mutations={mutations} />;
      break;
    case "types":
      content = <TypesDoc types={types} />;
      break;
    default:
      return notFound();
  }

  return <DocsLayout currentPage="api">{content}</DocsLayout>;
}

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const category = params?.category as string;
  console.log("Server side category:", category);

  if (!category || !["queries", "mutations", "types"].includes(category)) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      category,
    },
  };
};