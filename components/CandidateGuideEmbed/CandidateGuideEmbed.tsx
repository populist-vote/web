import { useEmbedResizer } from "hooks/useEmbedResizer";
import styles from "./CandidateGuideEmbed.module.scss";
import { WidgetFooter } from "components/WidgetFooter/WidgetFooter";
import Divider from "components/Divider/Divider";
import {
  State,
  useCandidateGuideSubmissionsByRaceIdQuery,
  useEmbedByIdQuery,
} from "generated";
import { LoaderFlag } from "components/LoaderFlag/LoaderFlag";
import states from "utils/states";
import { getYear } from "utils/dates";
import { LanguageSelect } from "components/LanguageSelect/LanguageSelect";
import { useState } from "react";
import { BiChevronLeft } from "react-icons/bi";

export function CandidateGuideEmbed({
  embedId,
  candidateGuideId,
  origin,
}: {
  embedId: string;
  candidateGuideId: string;
  origin: string;
}) {
  const { data: embedData } = useEmbedByIdQuery({
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
  if (isLoading) return <LoaderFlag />;

  return (
    <div className={styles.widgetContainer} style={{ maxWidth: "900px" }}>
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
          <LanguageSelect />
        </div>
        <Divider color="var(--grey-light)" />
        {!selectedQuestion ? (
          <>
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
          <>
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
            <div>
              {submissions.map((s) => (
                <div key={s.id} className={styles.submission}>
                  <h4>{s.politician?.fullName}</h4>
                  <p>{s.response}</p>
                </div>
              ))}
            </div>
          </>
        )}
      </main>
      <WidgetFooter />
    </div>
  );
}
