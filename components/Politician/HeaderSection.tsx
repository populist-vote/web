import { useState, useEffect, useCallback } from "react";
import { useQueryClient } from "react-query";
import { default as classNames } from "classnames";
import { PartyAvatar, Button } from "components";
import { EditVotingGuideCandidate } from "components/Ballot/Race";
import useDeviceInfo from "hooks/useDeviceInfo";
import { useVotingGuide } from "hooks/useVotingGuide";
import { PERSON_FALLBACK_IMAGE_URL } from "utils/constants";
import {
  PoliticalParty,
  PoliticianResult,
  useUpsertVotingGuideCandidateMutation,
} from "generated";
import styles from "styles/page.module.scss";
import headerStyles from "./HeaderSection.module.scss";

enum NoteState {
  View,
  Edit,
}

function HeaderSection({
  politician,
}: {
  politician: Partial<PoliticianResult>;
}) {
  const sectionCx = classNames(
    styles.center,
    styles.borderBottom,
    headerStyles.headerSection
  );

  const { isMobile } = useDeviceInfo();

  const {
    data: guideData,
    isGuideOwner,
    queryKey,
    enabled: guideEnabled,
  } = useVotingGuide();

  const queryClient = useQueryClient();

  const invalidateVotingGuideQuery = () =>
    queryClient.invalidateQueries(queryKey);

  const isEndorsed = guideEnabled
    ? guideData?.candidates
        ?.filter((c) => c.isEndorsement)
        .map((c) => c.politician.id)
        .includes(politician.id as string)
    : false;

  const [noteState, setNoteState] = useState(NoteState.View);
  const [note, setNote] = useState<string>();

  const getInitialNote = useCallback(
    () =>
      guideData?.candidates?.find((c) => c.politician.id === politician.id)
        ?.note,
    [guideData?.candidates, politician.id]
  );

  useEffect(() => {
    if (note === undefined) {
      setNote(getInitialNote() || undefined);
    }
  }, [setNote, note, getInitialNote]);

  const upsertVotingGuideCandidate = useUpsertVotingGuideCandidateMutation();

  const editVotingGuideCandidate = ({
    isEndorsement,
    note,
    onSuccess,
    candidateId = politician.id || "",
  }: Partial<EditVotingGuideCandidate>) => {
    upsertVotingGuideCandidate.mutate(
      {
        votingGuideId: guideData.id,
        candidateId,
        isEndorsement,
        note,
      },
      {
        onSuccess: () => {
          invalidateVotingGuideQuery().catch((err) =>
            console.error("Problem invalidating query", err)
          );
          if (onSuccess) onSuccess();

          //auto unendorse others in race
          if (isEndorsement) {
            politician.upcomingRace?.candidates.forEach((c) =>
              editVotingGuideCandidate({
                candidateId: c.id,
                isEndorsement: false,
              })
            );
          }
        },
      }
    );
  };

  const toggleEndorsement = () =>
    editVotingGuideCandidate({ isEndorsement: !isEndorsed });

  const addNote = () =>
    editVotingGuideCandidate({
      note,
      onSuccess: () => setNoteState(NoteState.View),
    });

  return (
    <section className={sectionCx}>
      <PartyAvatar
        key={politician?.id}
        badgeSize={"3.125rem"}
        badgeFontSize={"2rem"}
        iconSize={guideEnabled ? "3.125rem" : undefined}
        size={200}
        party={politician?.party as PoliticalParty}
        src={
          (politician?.thumbnailImageUrl ||
            politician?.votesmartCandidateBio?.candidate.photo) as string
        }
        fallbackSrc={PERSON_FALLBACK_IMAGE_URL}
        alt={politician?.fullName as string}
        iconType={guideEnabled ? "star" : undefined}
        isEndorsement={isEndorsed}
        handleIconClick={() => toggleEndorsement()}
        hasIconMenu={true}
      />
      {!isMobile && (
        <h1 className={headerStyles.fullName}>{politician?.fullName}</h1>
      )}

      <div className={headerStyles.note}>
        <span className={headerStyles.header}>Voting Guide Note</span>
        {guideEnabled && noteState === NoteState.View && (
          <>
            <div className={headerStyles.noteText}>{note}</div>
            {isGuideOwner && (
              <div>
                <div className={headerStyles.buttonArea}>
                  <Button
                    label={note ? "Edit note" : "Add note"}
                    onClick={() => setNoteState(NoteState.Edit)}
                    variant="secondary"
                    size="medium"
                  />
                  {note && (
                    <Button
                      variant="secondary"
                      size="medium"
                      label="Delete Note"
                      onClick={() => {
                        setNote("");
                        addNote();
                      }}
                    />
                  )}
                </div>
              </div>
            )}
          </>
        )}
        {noteState === NoteState.Edit && (
          <div>
            <textarea
              value={note || ""}
              onChange={(e) => setNote(e.target.value)}
            />

            <div className={headerStyles.buttonArea}>
              <Button
                label="Save note"
                onClick={() => addNote()}
                variant="secondary"
                size="medium"
              />
              <Button
                label="Cancel"
                onClick={() => {
                  setNote(getInitialNote() || "");
                  setNoteState(NoteState.View);
                }}
                variant="secondary"
                size="medium"
              />
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

export default HeaderSection;
