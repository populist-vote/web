import { useState, useEffect, useCallback } from "react";
import { useQueryClient } from "react-query";
import { default as clsx } from "clsx";
import { Avatar, PartyAvatar, Button } from "components";
import { EditVotingGuideCandidate } from "components/Ballot/Race";
import { useVotingGuide } from "hooks/useVotingGuide";
import { PERSON_FALLBACK_IMAGE_400_URL } from "utils/constants";
import {
  PoliticalParty,
  PoliticianResult,
  useUpsertVotingGuideCandidateMutation,
} from "generated";
import styles from "./HeaderSection.module.scss";
import { CSSProperties } from "styled-components";

enum NoteState {
  View,
  Edit,
}

function HeaderSection({
  basicInfo,
}: {
  basicInfo: Partial<PoliticianResult>;
}) {
  const sectionCx = clsx(styles.center, styles.borderTop, styles.headerSection);

  const politician = basicInfo;
  const votingGuideQuery = useVotingGuide();
  const {
    data: guideData,
    isGuideOwner,
    guideAuthor,
    queryKey,
    enabled: guideEnabled,
  } = votingGuideQuery;

  const queryClient = useQueryClient();

  const invalidateVotingGuideQuery = () =>
    queryClient.invalidateQueries(queryKey);

  const isEndorsed = guideEnabled
    ? guideData?.candidates
        ?.filter((c) => c.isEndorsement)
        .map((c) => c.politician.id)
        .includes(politician?.id as string)
    : false;

  const [noteState, setNoteState] = useState(NoteState.View);
  const [note, setNote] = useState<string>();

  const getInitialNote = useCallback(
    () =>
      guideData?.candidates?.find((c) => c.politician.id === politician?.id)
        ?.note,
    [guideData?.candidates, politician?.id]
  );

  useEffect(() => {
    if (note === undefined) {
      setNote(getInitialNote() || undefined);
    }
  }, [setNote, note, getInitialNote]);

  const upsertVotingGuideCandidate = useUpsertVotingGuideCandidateMutation();

  interface EditVotingGuidePolitician
    extends Partial<EditVotingGuideCandidate> {
    onSuccess?: () => void;
  }

  const editVotingGuideCandidate = ({
    isEndorsement,
    note,
    onSuccess,
  }: EditVotingGuidePolitician) => {
    upsertVotingGuideCandidate.mutate(
      {
        votingGuideId: guideData.id,
        candidateId: politician?.id || "",
        isEndorsement,
        note,
      },
      {
        onSuccess: () => {
          invalidateVotingGuideQuery().catch((err) =>
            console.error("Problem invalidating query", err)
          );
          if (onSuccess) onSuccess();
        },
      }
    );
  };

  const toggleEndorsement = () =>
    editVotingGuideCandidate({ isEndorsement: !isEndorsed });

  const addNote = () =>
    editVotingGuideCandidate({
      note,
      onSuccess: () => {
        setNoteState(NoteState.View);
      },
    });

  const deleteNote = () =>
    editVotingGuideCandidate({
      note: "",
      onSuccess: () => {
        setNoteState(NoteState.View);
      },
    });

  const noteVars: CSSProperties & {
    "--note-top-margin": string;
    "--note-top-padding": string;
    "--note-top-border": string;
  } = {
    "--note-top-margin": !!note || noteState === NoteState.Edit ? "2rem" : "0",
    "--note-top-padding":
      !!note || noteState === NoteState.Edit ? "2.5rem" : "0",
    "--note-top-border":
      !!note || noteState === NoteState.Edit ? "solid 1px" : "none",
  };

  return (
    <section className={sectionCx}>
      <PartyAvatar
        key={politician?.id}
        badgeSize={"3.125rem"}
        badgeFontSize={"2rem"}
        borderWidth="6px"
        iconSize={guideEnabled ? "3.125rem" : undefined}
        size={200}
        party={politician?.party as PoliticalParty}
        src={
          (politician?.assets?.thumbnailImage400 ||
            politician?.thumbnailImageUrl ||
            politician?.votesmartCandidateBio?.candidate.photo) as string
        }
        fallbackSrc={PERSON_FALLBACK_IMAGE_400_URL}
        alt={politician?.fullName as string}
        iconType={guideEnabled ? "star" : undefined}
        isEndorsement={isEndorsed}
        handleIconClick={() => toggleEndorsement()}
        hasIconMenu={true}
      />

      <h1 className={styles.fullName}>{politician?.fullName}</h1>

      {guideData && (
        <div className={styles.note} style={noteVars}>
          {(note || noteState === NoteState.Edit) && (
            <h4 className={styles.header}>
              {isGuideOwner ? "Your" : `${guideAuthor.name}'s`} Note
            </h4>
          )}
          {guideEnabled && noteState === NoteState.View && (
            <>
              <div className={styles.noteText}>{note}</div>
              {!isGuideOwner && (
                <Avatar
                  src={guideAuthor?.profilePictureUrl as string}
                  alt={guideAuthor?.name as string}
                  size={80}
                />
              )}
              {isGuideOwner && (
                <div>
                  <div className={styles.buttonArea}>
                    <Button
                      label={note ? "Edit note" : "Add note"}
                      onClick={() => setNoteState(NoteState.Edit)}
                      variant="primary"
                      size="large"
                    />

                    {note && (
                      <Button
                        variant="secondary"
                        size="large"
                        label="Delete note"
                        onClick={() => {
                          setNote("");
                          deleteNote();
                        }}
                      />
                    )}
                  </div>
                </div>
              )}
            </>
          )}
          {noteState === NoteState.Edit && (
            <div className={styles.editContainer}>
              <textarea
                value={note || ""}
                onChange={(e) => setNote(e.target.value)}
              />

              <div className={styles.buttonArea}>
                <Button
                  label="Save note"
                  onClick={() => addNote()}
                  variant="primary"
                  disabled={!note?.length}
                  size="large"
                />
                <Button
                  label="Cancel"
                  onClick={() => {
                    setNote(getInitialNote() || "");
                    setNoteState(NoteState.View);
                  }}
                  variant="secondary"
                  size="large"
                />
              </div>
            </div>
          )}
        </div>
      )}
    </section>
  );
}

export { HeaderSection };
