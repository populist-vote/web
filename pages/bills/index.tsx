import { ReactElement } from "react";
import { Layout } from "components";
import { NextPageWithLayout } from "../_app";

const BillIndex: NextPageWithLayout = () => {
  return <h1>Bills</h1>;
};

BillIndex.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export default BillIndex;
