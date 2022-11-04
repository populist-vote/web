import { useState } from "react";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import { dehydrate, QueryClient } from "react-query";
import { FaGlobe } from "react-icons/fa";

import {
  Avatar,
  Layout,
  LoaderFlag,
  IssueTags,
  Button,
  PoliticianNote,
} from "components";

import { DEFAULT_LANGUAGE, Language, Languages } from "utils/constants";

import {
  OrganizationBySlugQuery,
  useOrganizationBySlugQuery,
  useOrganizationPoliticianNotesQuery,
  useElectionBySlugQuery,
  IssueTagResult,
} from "../../generated";

import styles from "./OrganizationPage.module.scss";
import { ORGANIZATION_FALLBACK_IMAGE_400_URL } from "utils/constants";
import { NextParsedUrlQuery } from "next/dist/server/request-meta";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { SupportedLocale } from "types/global";
import nextI18nextConfig from "next-i18next.config";

function OrganizationPage({ mobileNavTitle }: { mobileNavTitle: string }) {
  const electionQuery = useElectionBySlugQuery({
    slug: "general-election-2022",
  });
  const electionId = electionQuery.data?.electionBySlug.id as string;

  const { query } = useRouter();
  const slug = query.slug as string;
  const { data, isLoading, error } = useOrganizationBySlugQuery({ slug });

  const notesQuery = useOrganizationPoliticianNotesQuery(
    { slug, electionId },
    { enabled: !!electionId }
  );

  const [issueIndex, setIssueIndex] = useState(0); //This should be changed to slug to be able to use in the url
  const [language, setLanguage] = useState<Language>(DEFAULT_LANGUAGE);

  const unfilteredNotes =
    notesQuery.data?.organizationBySlug.politicianNotes || [];
  /* Can't use a Set to simplify this problem because two objects are not unique in JavaScript, 
     even if they have the same values, because they have different memory references.
     So for now we will do this by mutating an array. */
  const noteIssues = [] as IssueTagResult[];

  unfilteredNotes
    .flatMap((note) => note.issueTags)
    .forEach((note) => {
      if (noteIssues.findIndex((i) => note.id === i.id) === -1)
        noteIssues.push(note as IssueTagResult);
    });

  const noteMap = noteIssues.map((issue) => {
    const filteredNotes = unfilteredNotes
      .filter((note) => {
        const theTag = note.issueTags[0];
        return theTag?.id === issue.id;
      })
      .map((f) => ({ politician: f.politician, notes: f.notes }));

    return {
      issueTag: issue,
      politicianNotes: filteredNotes,
    };
  });

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
      <div className={styles.content}>
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
        {slug.toLowerCase() === "mpr-news" && noteIssues.length > 0 && (
          <>
            <h2>Voting Guides</h2>

            {Languages.map((l) => (
              <Button
                key={l.code}
                disabled={language === l.code}
                size="small"
                onClick={() => setLanguage(l.code)}
                label={l.display}
                id={l.code}
                variant="text"
              />
            ))}

            {notesQuery.isLoading || electionQuery.isLoading ? (
              <LoaderFlag />
            ) : (
              <div className={styles.votingGuideIssues}>
                <div>
                  <ul>
                    {noteMap.map((n, i) => (
                      <li key={n.issueTag.id}>
                        <Button
                          disabled={issueIndex === i}
                          size="small"
                          onClick={() => setIssueIndex(i)}
                          label={n.issueTag.name}
                          id={n.issueTag.id}
                          variant="text"
                        />
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  {noteMap[issueIndex]?.politicianNotes.map((note) => (
                    <PoliticianNote
                      key={note.politician.slug}
                      politician={note.politician}
                      note={note.notes}
                      itemId={note.politician.slug}
                      language={language}
                    />
                  ))}
                </div>
              </div>
            )}
          </>
        )}
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
        nextI18nextConfig
      )),
    },
  };
};
