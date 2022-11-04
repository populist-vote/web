import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import { dehydrate, QueryClient } from "react-query";
import { FaGlobe } from "react-icons/fa";

import { Avatar, Layout, LoaderFlag, IssueTags, Button } from "components";

import {
  OrganizationBySlugQuery,
  useOrganizationBySlugQuery,
} from "../../generated";

import styles from "./OrganizationPage.module.scss";
import { ORGANIZATION_FALLBACK_IMAGE_400_URL } from "utils/constants";
import { NextParsedUrlQuery } from "next/dist/server/request-meta";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { SupportedLocale } from "types/global";
import nextI18nextConfig from "next-i18next.config";
import { PoliticianNotes } from "components/OrganizationPage/PoliticianNotes/PoliticianNotes";

function OrganizationPage({ mobileNavTitle }: { mobileNavTitle: string }) {
  const { query } = useRouter();
  const slug = query.slug as string;
  const { data, isLoading, error } = useOrganizationBySlugQuery({ slug });

  if (isLoading) return <LoaderFlag />;

  if (error) {
    console.error("Organization Error", error);
    return (
      <p>
        Organization Query Error. Please reload. <br />
        Error: {JSON.stringify(error)}
      </p>
    );
  }

  const { organizationBySlug: organization } = data || {};
  return (
    <Layout mobileNavTitle={mobileNavTitle} showNavLogoOnMobile={true}>
      <section className={styles.content}>
        <h1 className={styles.orgLogo}>
          <Avatar
            src={
              (organization?.assets?.thumbnailImage400 ||
                organization?.assets?.thumbnailImage160 ||
                organization?.thumbnailImageUrl) as string
            }
            fallbackSrc={ORGANIZATION_FALLBACK_IMAGE_400_URL}
            alt={organization?.name as string}
            size={200}
          />
        </h1>

        <h1 className={styles.mainTitle}>{organization?.name}</h1>
        {organization?.issueTags && <IssueTags tags={organization.issueTags} />}

        <div className={styles.divider} />
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
      </section>
      <div className={styles.divider} />
      <section>
        <PoliticianNotes />
      </section>
    </Layout>
  );
}

export default OrganizationPage;

interface Params extends NextParsedUrlQuery {
  slug: string;
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { locale, params } = ctx;
  const { slug } = params as Params;

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
      mobileNavTitle: data?.organizationBySlug?.name,
      title: data?.organizationBySlug?.name,
      ...(await serverSideTranslations(
        locale as SupportedLocale,
        ["auth", "common"],
        nextI18nextConfig
      )),
    },
  };
};
