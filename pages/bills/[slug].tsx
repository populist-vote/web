import type { GetServerSideProps, NextPage } from "next";
import { useRouter } from "next/router";
import {
  Layout,
  LoaderFlag,
  ColoredSection,
  LegislationStatusBox,
} from "components";
import { NextParsedUrlQuery } from "next/dist/server/request-meta";
import { dehydrate, QueryClient } from "@tanstack/react-query";
import { BillBySlugQuery, useBillBySlugQuery } from "generated";
import styles from "./BillBySlug.module.scss";
import layoutStyles from "../../components/BasicLayout/BasicLayout.module.scss";

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
  if (error) return <>Error: {error}</>;

  const bill = data?.billBySlug;
  const summary = bill?.populistSummary || bill?.description;

  if (!bill) return null;
  return (
    <Layout mobileNavTitle={mobileNavTitle} showNavLogoOnMobile>
      <ColoredSection color="var(--blue-dark)">
        <div className={styles.billContainer}>
          <p className={styles.codeName}>{bill?.billNumber}</p>
          <h1>{bill?.title}</h1>
          <LegislationStatusBox status={bill.legislationStatus} />

          {summary && (
            <section className={styles.center}>
              <h2>Summary</h2>
              <p>{summary}</p>
            </section>
          )}
          <section className={styles.center}>
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
          {/* <h2 className={styles.gradientHeader}>Arguments</h2> */}
        </div>
      </ColoredSection>
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
  const state = dehydrate(queryClient);

  const data = state.queries[0]?.state.data as BillBySlugQuery;

  return {
    notFound: state.queries.length === 0,
    props: {
      dehydratedState: state,
      mobileNavTitle: data.billBySlug?.billNumber,
    },
  };
};
