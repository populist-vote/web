import { useState, useEffect, useCallback } from "react";
import { useQueryClient } from "react-query";
import { default as classNames } from "classnames";
import { PartyAvatar, Button } from "components";
import { EditVotingGuideCandidate } from "components/Ballot/Race";
import { useVotingGuide } from "hooks/useVotingGuide";
import { PERSON_FALLBACK_IMAGE_URL } from "utils/constants";
import {
  PoliticalParty,
  PoliticianResult,
  useUpsertVotingGuideCandidateMutation,
} from "generated";
import styles from "styles/page.module.scss";
import headerStyles from "./HeaderSection.module.scss";
import { CSSProperties } from "styled-components";

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
    // styles.borderTop,
    headerStyles.headerSection
  );

  const votingGuideQuery = useVotingGuide();
  const {
    data: guideData,
    isGuideOwner,
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
        candidateId: politician.id || "",
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
          (politician?.thumbnailImageUrl ||
            politician?.votesmartCandidateBio?.candidate.photo) as string
        }
        fallbackSrc={PERSON_FALLBACK_IMAGE_URL}
        alt={politician?.fullName as string}
        iconType={guideEnabled && isEndorsed ? "star" : undefined}
        isEndorsement={isEndorsed}
        handleIconClick={() => toggleEndorsement()}
        hasIconMenu={true}
      />

      <h1 className={headerStyles.fullName}>{politician?.fullName}</h1>

      {guideData && (
        <div className={headerStyles.note} style={noteVars}>
          {(note || noteState === NoteState.Edit) && (
            <h4 className={headerStyles.header}>Voting Guide Note</h4>
          )}
          {guideEnabled && noteState === NoteState.View && (
            <>
              <div className={headerStyles.noteText}>{note}</div>
              {isGuideOwner && (
                <div>
                  <div className={headerStyles.buttonArea}>
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
            <div className={headerStyles.editContainer}>
              <textarea
                value={note || ""}
                onChange={(e) => setNote(e.target.value)}
              />

              <div className={headerStyles.buttonArea}>
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
