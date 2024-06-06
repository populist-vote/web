import { useEmbedResizer } from "hooks/useEmbedResizer";
import styles from "./CandidateGuideEmbed.module.scss";
import { WidgetFooter } from "components/WidgetFooter/WidgetFooter";
import Divider from "components/Divider/Divider";
import {
  PoliticalParty,
  RaceResult,
  State,
  useCandidateGuideEmbedByIdQuery,
  useCandidateGuideSubmissionsByRaceIdQuery,
} from "generated";
import { LoaderFlag } from "components/LoaderFlag/LoaderFlag";
import states from "utils/states";
import { getYear } from "utils/dates";
import { useState } from "react";
import { BiChevronLeft } from "react-icons/bi";
import { PartyAvatar } from "components/Avatar/Avatar";
import clsx from "clsx";
import { Race } from "components/Ballot/Race";

export function CandidateGuideEmbed({
  embedId,
  candidateGuideId,
  origin,
}: {
  embedId: string;
  candidateGuideId: string;
  origin: string;
}) {
  const { data: embedData, isLoading: embedLoading } =
    useCandidateGuideEmbedByIdQuery({
      id: embedId,
    });

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
      }
    );

  // Submissions for the selected question
  const submissions =
    submissionData?.candidateGuideById?.questions.find(
      (q) => q.id == selectedQuestionId
    )?.submissionsByRace || [];

  useEmbedResizer({ origin, embedId });

  if (isLoading || embedLoading) return <LoaderFlag />;

  return (
    <div
      className={styles.widgetContainer}
      style={{ width: "720px", height: "auto" }}
    >
      <header className={styles.header}>
        <strong>Candidate Guide</strong>
        <strong>
          {getYear(election?.electionDate)} - {election?.title}
        </strong>
      </header>
      <main>
        {/* <pre>{JSON.stringify(embedData, null, 2)}</pre> */}
        <div className={styles.title}>
          <div className={styles.flexEvenly}>
            <h2>{race?.office.name}</h2>
            <Divider vertical color="var(--grey-dark)" />
            <h2>{states[race?.state as State]}</h2>
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
              />
            </div>
            <h4>Questions</h4>
            <div className={styles.questionContainer}>
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
          </>
        ) : (
          <div>
            <div className={styles.flexBetween}>
              <div>
                <h4>Question</h4>
                <h3 style={{ fontWeight: "bold" }}>
                  {selectedQuestion.prompt}
                </h3>
              </div>
              <button
                className={styles.backButton}
                onClick={() => setSelectedQuestionId(null)}
              >
                <BiChevronLeft /> Back
              </button>
            </div>
            <div className={styles.submissionsContainer}>
              {submissions.map((s, i) => (
                <>
                  <div key={s.id} className={styles.submission}>
                    <div className={styles.avatarContainer}>
                      <PartyAvatar
                        theme={"light"}
                        size={80}
                        hasIconMenu
                        iconSize="1.25rem"
                        party={s.politician?.party as PoliticalParty}
                        src={s.politician?.assets?.thumbnailImage160 as string}
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
                  {i !== submissions.length - 1 && (
                    <Divider color="var(--grey-light)" />
                  )}
                </>
              ))}
            </div>
          </div>
        )}
      </main>
      <WidgetFooter />
    </div>
  );
}
