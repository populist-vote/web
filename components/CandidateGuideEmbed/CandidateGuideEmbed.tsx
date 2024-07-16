import { useEmbedResizer } from "hooks/useEmbedResizer";
import styles from "./CandidateGuideEmbed.module.scss";
import { WidgetFooter } from "components/WidgetFooter/WidgetFooter";
import Divider from "components/Divider/Divider";
import {
  PoliticalParty,
  RaceResult,
  useCandidateGuideEmbedByIdQuery,
  useCandidateGuideSubmissionsByRaceIdQuery,
} from "generated";
import { LoaderFlag } from "components/LoaderFlag/LoaderFlag";

import { getYear } from "utils/dates";
import { useState } from "react";
import { BsChevronLeft } from "react-icons/bs";
import { PartyAvatar } from "components/Avatar/Avatar";
import clsx from "clsx";
import { Race } from "components/Ballot/Race";

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
  const { data: embedData, isLoading: embedLoading } =
    useCandidateGuideEmbedByIdQuery(
      {
        id: embedId,
      },
      {
        staleTime: 1000 * 60 * 5,
      }
    );

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

  useEmbedResizer({ origin, embedId });

  if (isLoading || embedLoading) return <LoaderFlag />;

  return (
    <div
      className={clsx(styles.widgetContainer, styles.candidateGuideContainer)}
      style={{
        height: `${renderOptions?.height || 700}px`,
        minHeight: "fit-content",
      }}
    >
      <header className={styles.header}>
        <strong>Candidate Guide</strong>
        <strong>
          {getYear(election?.electionDate)} - {election?.title}
        </strong>
      </header>
      <main className={styles.contentContainer}>
        <div className={styles.title}>
          <div className={clsx(styles.flexEvenly, styles.officeHeader)}>
            <h2 className={styles.officeName}>{race?.office.name}</h2>
            <h2 className={styles.officeSubtitle}>{race?.office?.subtitle}</h2>
          </div>
          {/* <LanguageSelect /> */}
        </div>
        <Divider color="var(--grey-light)" />

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
            <h4 className={styles.questionsTitle}>Questions</h4>
            <div className={styles.overflowGradient}>
              <div className={styles.questionsContainer}>
                {embedData?.embedById.candidateGuide?.questions.map((q) => (
                  <button
                    className={styles.questionButton}
                    key={q.id}
                    onClick={() => setSelectedQuestionId(q.id)}
                    onKeyDown={() => setSelectedQuestionId(q.id)}
                  >
                    {q.prompt}
                  </button>
                ))}
              </div>
            </div>
          </>
        ) : (
          <div className={styles.contentContainer}>
            <div className={styles.questionHeader}>
              <h4 className={styles.questionsTitle}>Question</h4>
              <button
                className={styles.backButton}
                onClick={() => setSelectedQuestionId(null)}
              >
                <BsChevronLeft size={"0.75rem"} /> Back
              </button>
            </div>
            <div className={styles.question}>
              <h3>{selectedQuestion.prompt}</h3>
            </div>
            <div className={styles.overflowGradient}>
              <div className={styles.submissionsContainer}>
                {submissions.map((s) => (
                  <>
                    <div key={s.id} className={styles.submission}>
                      <div className={styles.avatarContainer}>
                        <PartyAvatar
                          theme={"light"}
                          size={80}
                          iconSize="1.25rem"
                          party={s.politician?.party as PoliticalParty}
                          src={
                            s.politician?.assets?.thumbnailImage160 as string
                          }
                          alt={s.politician?.fullName as string}
                          target={"_blank"}
                          rel={"noopener noreferrer"}
                        />
                        <span className={clsx(styles.link, styles.avatarName)}>
                          {s.politician?.fullName}
                        </span>
                      </div>
                      <div>
                        <p>{s.response}</p>
                      </div>
                    </div>
                  </>
                ))}
                {politiciansWithNoSubmissions?.map((p) => (
                  <>
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
                      <p className={styles.noResponse}>NO RESPONSE</p>
                    </div>
                  </>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>
      <WidgetFooter />
    </div>
  );
}
