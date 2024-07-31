import { useEmbedResizer } from "hooks/useEmbedResizer";
import styles from "./CandidateGuideEmbed.module.scss";
import { WidgetFooter } from "components/WidgetFooter/WidgetFooter";
import Divider from "components/Divider/Divider";
import {
  OrganizationResult,
  PoliticalParty,
  PoliticianResult,
  QuestionResult,
  RaceResult,
  useCandidateGuideEmbedByIdQuery,
  useCandidateGuideSubmissionsByRaceIdQuery,
  useOrganizationByIdQuery,
  VoteType,
} from "generated";
import { LoaderFlag } from "components/LoaderFlag/LoaderFlag";

import { getYear } from "utils/dates";
import { useRef, useState } from "react";
import { BsChevronLeft } from "react-icons/bs";
import { PartyAvatar } from "components/Avatar/Avatar";
import clsx from "clsx";
import { Race } from "components/Ballot/Race";
import { Badge } from "components/Badge/Badge";
import { LanguageSelect } from "components/LanguageSelect/LanguageSelect";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";
import { LANGUAGES } from "utils/constants";
import Markdown from "react-markdown";
import Image from "next/image";

interface CandidateGuideRenderOptions {
  height: number;
}

export function CandidateGuideEmbed({
  embedId,
  candidateGuideId,
  origin,
  renderOptions,
}: {
  embedId: string;
  candidateGuideId: string;
  origin: string;
  renderOptions: CandidateGuideRenderOptions;
}) {
  const router = useRouter();
  const { locale } = router;
  const { data: embedData, isLoading: embedLoading } =
    useCandidateGuideEmbedByIdQuery(
      {
        id: embedId,
      },
      {
        staleTime: 1000 * 60 * 5,
      }
    );

  const organizationId = embedData?.embedById.organizationId;

  const { data: organizationData, isLoading: organizationLoading } =
    useOrganizationByIdQuery(
      {
        id: organizationId as string,
      },
      {
        enabled: !!organizationId,
      }
    );
  const organization = organizationData?.organizationById;

  const [selectedQuestionId, setSelectedQuestionId] = useState<string | null>(
    null
  );

  const selectedQuestion = embedData?.embedById.candidateGuide?.questions.find(
    (q) => q.id === selectedQuestionId
  );

  const race = embedData?.embedById.race;
  const election = race?.election;

  const { data: submissionData, isLoading } =
    useCandidateGuideSubmissionsByRaceIdQuery(
      {
        candidateGuideId: candidateGuideId,
        raceId: race?.id as string,
      },
      {
        enabled: race?.id !== undefined,
        staleTime: 1000 * 60 * 5,
      }
    );

  // Submissions for the selected question
  const submissions =
    submissionData?.candidateGuideById?.questions.find(
      (q) => q.id == selectedQuestionId
    )?.submissionsByRace || [];

  const politiciansWithSubmissions = submissions.map(
    (submission) => submission.politician
  );

  const politiciansWithNoSubmissions = race?.candidates.filter(
    (candidate) =>
      !politiciansWithSubmissions.some((p) => p?.id === candidate.id)
  );

  const shouldDisplayRaceLabels =
    race?.voteType === VoteType.RankedChoice || (race?.numElect ?? 0) > 1;

  const shouldDisplayLanguageSelect =
    submissionData?.candidateGuideById.questions
      .flatMap((q) => q.submissionsByRace)
      .some((sub) => !!sub.translations.response);

  const availableLanguageCodes = submissionData?.candidateGuideById.questions
    .flatMap((q) => q.submissionsByRace)
    .flatMap((sub) =>
      Object.entries(sub?.translations.response || {}).filter(([, v]) => !!v)
    )
    .map(([k]) => k);

  const availableLanguages = LANGUAGES.filter(
    (lang) => availableLanguageCodes?.includes(lang.code) || lang.code === "en"
  );

  const { t } = useTranslation("embeds");

  const submissionsContainerRef = useRef<HTMLDivElement>(null);

  const scrollToTopOfSubmissions = () => {
    submissionsContainerRef.current?.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  useEmbedResizer({ origin, embedId });

  if (isLoading || embedLoading || organizationLoading) return <LoaderFlag />;

  return (
    <div
      className={clsx(styles.widgetContainer, styles.candidateGuideContainer)}
      style={{
        height: `${renderOptions?.height || 700}px`,
        minHeight: "fit-content",
      }}
    >
      <header className={styles.header}>
        <strong>{t("candidate-guide")}</strong>
        <strong>
          {getYear(election?.electionDate)} - {election?.title}
        </strong>
      </header>
      <main className={styles.contentContainer}>
        <div className={styles.titleSection}>
          <div className={styles.title}>
            <div className={clsx(styles.flexEvenly, styles.officeHeader)}>
              <h2 className={styles.officeName}>{race?.office.name}</h2>
              <h2 className={styles.officeSubtitle}>
                {race?.office?.subtitle}
              </h2>
            </div>
            {shouldDisplayLanguageSelect && (
              <LanguageSelect languages={availableLanguages} />
            )}
          </div>
          {shouldDisplayRaceLabels && (
            <section className={styles.raceLabels}>
              {race?.voteType === VoteType.RankedChoice && (
                <Badge size="small" theme="grey" lightBackground>
                  Ranked Choice Vote
                </Badge>
              )}
              {(race?.numElect ?? 0) > 1 && (
                <Badge size="small" theme="grey" lightBackground>
                  Elect {race?.numElect}
                </Badge>
              )}
            </section>
          )}
        </div>

        <Divider color="var(--grey-light)" style={{ margin: "1rem 0" }} />

        {!selectedQuestion ? (
          <>
            <div className={styles.raceContainer}>
              <Race
                race={race as RaceResult}
                itemId={race?.id as string}
                theme="light"
                isEmbedded={true}
              />
            </div>
            <h4 className={styles.questionsTitle}>{t("questions")}</h4>
            <div className={styles.overflowGradient}>
              <div className={styles.questionsContainer}>
                {embedData?.embedById.candidateGuide?.questions.map((q) => (
                  <button
                    className={styles.questionButton}
                    key={q.id}
                    onClick={() => setSelectedQuestionId(q.id)}
                    onKeyDown={() => setSelectedQuestionId(q.id)}
                  >
                    {locale && !!q.translations && q.translations[locale]
                      ? q.translations[locale]
                      : q.prompt}
                  </button>
                ))}
              </div>
            </div>
          </>
        ) : (
          <div className={styles.contentContainer}>
            <div className={styles.questionHeader}>
              <button
                className={styles.backButton}
                onClick={() => setSelectedQuestionId(null)}
              >
                {selectedQuestionId && <BsChevronLeft size={"0.75rem"} />}
                <h4 className={styles.questionsTitle}>{t("questions")}</h4>
              </button>
            </div>
            <div className={styles.question}>
              <h3>{selectedQuestion.prompt}</h3>
            </div>
            <div className={styles.overflowGradient}>
              <div
                className={styles.submissionsContainer}
                ref={submissionsContainerRef}
              >
                {submissions.map((submission) => (
                  <div key={submission.id} className={styles.submission}>
                    <div className={styles.avatarContainer}>
                      <PartyAvatar
                        theme={"light"}
                        size={80}
                        iconSize="1.25rem"
                        party={submission.politician?.party as PoliticalParty}
                        src={
                          submission.politician?.assets
                            ?.thumbnailImage160 as string
                        }
                        alt={submission.politician?.fullName as string}
                        target={"_blank"}
                        rel={"noopener noreferrer"}
                      />
                      <span className={clsx(styles.link, styles.avatarName)}>
                        {submission.politician?.fullName}
                      </span>
                    </div>
                    <div>
                      {locale &&
                      !!submission.translations &&
                      submission.translations.response?.[locale] ? (
                        <p>{submission.translations.response?.[locale]}</p>
                      ) : !!submission.response ? (
                        <p>{submission.response}</p>
                      ) : (
                        <NoResponse
                          key={submission.id}
                          organization={organization as OrganizationResult}
                          politician={submission.politician as PoliticianResult}
                          questions={
                            embedData?.embedById.candidateGuide
                              ?.questions as Array<QuestionResult>
                          }
                          race={race as RaceResult}
                        />
                      )}
                      {!!submission.editorial && (
                        <blockquote className={styles.editorialContainer}>
                          <div
                            className={styles.flexLeft}
                            style={{ gap: "0.5rem", marginBottom: "1rem" }}
                          >
                            <Image
                              src={
                                organization?.assets.thumbnailImage160 as string
                              }
                              alt="organization banner image"
                              height={25}
                              width={25}
                              style={{ borderRadius: "50%" }}
                            />
                            <span className={styles.orgHeader}>
                              {" "}
                              from {organization?.name}
                            </span>
                          </div>

                          <Markdown className={styles.markdown}>
                            {submission.editorial}
                          </Markdown>
                        </blockquote>
                      )}
                    </div>
                  </div>
                ))}
                {politiciansWithNoSubmissions?.map((p) => (
                  <div key={p.id} className={styles.submission}>
                    <div className={styles.avatarContainer}>
                      <PartyAvatar
                        theme={"light"}
                        size={80}
                        iconSize="1.25rem"
                        party={p?.party as PoliticalParty}
                        src={p?.assets?.thumbnailImage160 as string}
                        alt={p?.fullName as string}
                        target={"_blank"}
                        rel={"noopener noreferrer"}
                      />
                      <span className={clsx(styles.link, styles.avatarName)}>
                        {p?.fullName}
                      </span>
                    </div>
                    <NoResponse
                      key={p.id}
                      organization={organization as OrganizationResult}
                      politician={p as PoliticianResult}
                      questions={
                        embedData?.embedById.candidateGuide
                          ?.questions as Array<QuestionResult>
                      }
                      race={race as RaceResult}
                    />
                  </div>
                ))}

                {embedData?.embedById.candidateGuide?.questions
                  .filter((q) => q.id !== selectedQuestionId)
                  .map((q) => (
                    <button
                      className={styles.questionButton}
                      key={q.id}
                      onClick={() => {
                        setSelectedQuestionId(q.id);
                        scrollToTopOfSubmissions();
                      }}
                    >
                      {locale && !!q.translations && q.translations[locale]
                        ? q.translations[locale]
                        : q.prompt}
                    </button>
                  ))}
                <br />
              </div>
            </div>
          </div>
        )}
      </main>
      <WidgetFooter learnMoreHref={`/races/${race?.slug}`} />
    </div>
  );
}

function NoResponse({
  politician,
  organization,
  questions,
  race,
}: {
  politician: Partial<PoliticianResult>;
  organization?: OrganizationResult;
  questions: Array<QuestionResult>;
  race?: Partial<RaceResult>;
}) {
  const subject = `Please respond to the ${organization?.name} Q&A`;
  const body = `Dear ${politician?.fullName},

It was unfortunate to see your submission was missing from the ${organization?.name} and Populist candidate Q&A survey. I am interested in hearing your responses prior to making my decision for the ${race?.office?.name} election. The survey allows candidates to express in their own words why they are running for office. Here are the questions that ${organization?.name}  asks:

${questions.map((q, index) => `${index + 1}. ${q.prompt}`).join("\n")}

Thank you for your consideration.
                `;
  const encodedSubject = encodeURIComponent(subject);
  const encodedBody = encodeURIComponent(body);
  const cc = organization?.email ? `&cc=${organization?.email}` : "";
  const mailto = `mailto:${politician?.email}?subject=${encodedSubject}&body=${encodedBody}${cc}`;

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        gap: "0.5rem",
      }}
    >
      <p className={styles.noResponse}>NO RESPONSE</p>
      {!!politician.email && (
        <a
          href={mailto}
          target={"_blank"}
          rel={"noopener noreferrer"}
          className={styles.emailLink}
        >
          Ask this candidate a question directly.
        </a>
      )}
    </div>
  );
}
