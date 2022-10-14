import { GetServerSideProps } from "next";
import { Params } from "next/dist/server/router";
import { useRouter } from "next/router";
import { dehydrate, QueryClient } from "react-query";
import { FaGlobe } from "react-icons/fa";

import { Avatar, Layout, LoaderFlag, IssueTags, Button } from "components";

import {
  OrganizationBySlugQuery,
  useOrganizationBySlugQuery,
} from "../../generated";

import styles from "./OrganizationPage.module.scss";

function OrganizationPage({ mobileNavTitle }: { mobileNavTitle: string }) {
  const { query } = useRouter();
  const slug = query.slug as string;
  const { data, isLoading, error } = useOrganizationBySlugQuery({ slug });

  if (isLoading) return <LoaderFlag />;

  if (error) return <p>Error: {error}</p>;

  const { organizationBySlug: organization } = data || {};
  return (
    <Layout
      mobileNavTitle={mobileNavTitle}
      showNavBackButton
      showNavLogoOnMobile={true}
    >
      <div className={styles.content}>
        {organization?.thumbnailImageUrl && (
          <h1 className={styles.orgLogo}>
            <Avatar
              src={organization.thumbnailImageUrl}
              alt={organization.name}
              size={200}
            />
          </h1>
        )}

        <h1 className={styles.mainTitle}>{organization?.name}</h1>

        {organization?.issueTags && <IssueTags tags={organization.issueTags} />}

        <div className={styles.divider}></div>
        <p className={styles.descriptionText}>{organization?.description}</p>

        {organization?.websiteUrl && (
          <a
            aria-label={"Website"}
            href={organization?.websiteUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button
              icon={<FaGlobe />}
              label="Website"
              iconPosition="before"
              size="medium"
              variant="secondary"
            />
          </a>
        )}

        <div className={styles.divider}></div>
      </div>
    </Layout>
  );
}

export default OrganizationPage;

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { slug } = ctx.params as Params;

  const queryClient = new QueryClient();

  await queryClient.prefetchQuery(
    useOrganizationBySlugQuery.getKey({ slug }),
    useOrganizationBySlugQuery.fetcher({ slug })
  );
  const state = dehydrate(queryClient);

  const data = state.queries[0]?.state.data as OrganizationBySlugQuery;

  return {
    notFound: state.queries.length === 0,
    props: {
      dehydratedState: state,
      mobileNavTitle: data.organizationBySlug?.name,
    },
  };
};
