import type { NextPage } from "next";
import { ReactElement } from "react";
import { Layout } from "components";
import { NextPageWithLayout } from "../_app";

const BillIndex: NextPageWithLayout = () => {
  return <div>Bill Index Page</div>;
};

BillIndex.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export default BillIndex;
