import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import { FaFacebook, FaGlobe, FaInstagram, FaTwitter } from "react-icons/fa";
import { dehydrate, QueryClient } from "@tanstack/react-query";

import { Avatar, Layout, LoaderFlag, IssueTags, Button } from "components";

import {
  OrganizationBySlugQuery,
  useOrganizationBySlugQuery,
} from "graphql-codegen/generated";

import styles from "./OrganizationPage.module.scss";
import { ORGANIZATION_FALLBACK_IMAGE_400_URL } from "utils/constants";
import { NextParsedUrlQuery } from "next/dist/server/request-meta";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { SupportedLocale } from "global";
import nextI18NextConfig from "next-i18next.config";
import { PoliticianNotes } from "components/OrganizationPage/PoliticianNotes/PoliticianNotes";
import { useMediaQuery } from "hooks/useMediaQuery";

import { ColoredSection } from "components/ColoredSection/ColoredSection";

function OrganizationPage({ mobileNavTitle }: { mobileNavTitle: string }) {
  const isSmallScreen = useMediaQuery("(max-width: 968px)");
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
      <div className={styles.container}>
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
          {organization?.issueTags && (
            <IssueTags tags={organization.issueTags} />
          )}

          <div className={styles.divider} />
          <p className={styles.descriptionText}>{organization?.description}</p>
          <div className={styles.socialLinks}>
            {organization?.websiteUrl && (
              <a
                aria-label={"Website"}
                href={organization?.websiteUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                {isSmallScreen ? (
                  <FaGlobe />
                ) : (
                  <Button
                    icon={<FaGlobe />}
                    label="Website"
                    iconPosition="before"
                    size="medium"
                    variant="secondary"
                  />
                )}
              </a>
            )}
            {organization?.twitterUrl && (
              <a
                aria-label={"Twitter"}
                href={organization?.twitterUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                {isSmallScreen ? (
                  <FaTwitter />
                ) : (
                  <Button
                    icon={<FaTwitter />}
                    label="Twitter"
                    iconPosition="before"
                    size="medium"
                    variant="secondary"
                  />
                )}
              </a>
            )}
            {organization?.facebookUrl && (
              <a
                aria-label={"Facebook"}
                href={organization?.facebookUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                {isSmallScreen ? (
                  <FaFacebook />
                ) : (
                  <Button
                    icon={<FaFacebook />}
                    label="Facebook"
                    iconPosition="before"
                    size="medium"
                    variant="secondary"
                  />
                )}
              </a>
            )}
            {organization?.instagramUrl && (
              <a
                aria-label={"Instagram"}
                href={organization?.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                {isSmallScreen ? (
                  <FaInstagram />
                ) : (
                  <Button
                    icon={<FaInstagram />}
                    label="Instagram"
                    iconPosition="before"
                    size="medium"
                    variant="secondary"
                  />
                )}
              </a>
            )}
          </div>
        </section>

        <ColoredSection color="var(--blue)">
          <PoliticianNotes />
        </ColoredSection>
      </div>
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
        nextI18NextConfig
      )),
    },
  };
};
