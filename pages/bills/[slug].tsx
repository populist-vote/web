import type { NextPage } from "next";
import { useRouter } from "next/router";
import { ReactElement } from "react";
import Layout from "../../components/Layout/Layout";
import { LoaderFlag } from "../../components/LoaderFlag";
import { NextPageWithLayout } from "../_app";

const BillPage: NextPageWithLayout = () => {
  const { query } = useRouter();
  const slug = query.slug as string;

  // if (isLoading) return <LoaderFlag />;

  return <div>Bill: {slug}</div>;
};

BillPage.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export default BillPage;
