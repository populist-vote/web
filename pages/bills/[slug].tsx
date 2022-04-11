import type { GetServerSideProps, NextPage } from "next";
import { useRouter } from "next/router";
import { ReactElement } from "react";

import { Layout, LoaderFlag } from "components";

import { NextPageWithLayout } from "../_app";
import { NextParsedUrlQuery } from "next/dist/server/request-meta";
import { dehydrate, QueryClient } from "react-query";
import { BillBySlugQuery, useBillBySlugQuery } from "generated";
import styles from "styles/politicianPage.module.scss";
import layoutStyles from "../../components/BasicLayout/BasicLayout.module.scss";
import Link from "next/link";

const BillPage: NextPage<{ mobileNavTitle?: string }> = ({
  mobileNavTitle,
}: {
  mobileNavTitle?: string;
}) => {
  const { query } = useRouter();
  const slug = query.slug as string;

  const { data, isLoading, error } = useBillBySlugQuery(
    { slug },
    {
      refetchOnWindowFocus: false,
      staleTime: Infinity,
    }
  );

  if (isLoading) return <LoaderFlag />;
  if (error) return <p>Error: {error}</p>;

  let bill = data?.billBySlug;

  console.log(bill);

  return (
    <Layout
      mobileNavTitle={mobileNavTitle}
      showNavBackButton
      showNavLogoOnMobile={false}
    >
      <div className={styles.container}>
        <section className={styles.center}>
          <h1>{bill?.title}</h1>
        </section>
        <section className={styles.center}>
          <h2>Summary</h2>
          <p>{bill?.description}</p>
          {bill?.fullTextUrl && (
            <a
              href={bill?.fullTextUrl}
              className={layoutStyles.textLink}
              style={{ textTransform: "uppercase" }}
            >
              View full text
            </a>
          )}
        </section>
      </div>
    </Layout>
  );
};

export default BillPage;

interface Params extends NextParsedUrlQuery {
  slug: string;
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { slug } = ctx.params as Params;

  const queryClient = new QueryClient();

  await queryClient.prefetchQuery(
    useBillBySlugQuery.getKey({ slug }),
    useBillBySlugQuery.fetcher({ slug })
  );
  let state = dehydrate(queryClient);

  let data = state.queries[0].state.data as BillBySlugQuery;

  return {
    notFound: state.queries.length === 0,
    props: {
      dehydratedState: state,
      mobileNavTitle: data.billBySlug?.billNumber,
    },
  };
};
