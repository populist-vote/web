import { useState } from "react";
import { default as classNames } from "classnames";
import { PartyAvatar, Button } from "components";
import useDeviceInfo from "hooks/useDeviceInfo";
import { useVotingGuide } from "hooks/useVotingGuide";
import { PERSON_FALLBACK_IMAGE_URL } from "utils/constants";
import { PoliticalParty, PoliticianResult } from "../../generated";
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
    // queryKey,
    enabled: guideEnabled,
  } = useVotingGuide();

  const isEndorsing = guideEnabled
    ? guideData?.candidates
        ?.filter((c) => c.isEndorsement)
        .map((c) => c.politician.id)
        .includes(politician.id as string)
    : false;

  const initialNote = guideData?.candidates?.filter(
    (c) => c.politician.id === politician.id
  )[0]?.note;

  const [noteState, setNoteState] = useState(NoteState.View);
  const [note, setNote] = useState(initialNote);

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
        iconType="star"
        isEndorsement={isEndorsing}
        handleIconClick={() => alert("click")}
        hasIconMenu={true}
      />
      {!isMobile && (
        <h1 className={headerStyles.fullName}>{politician?.fullName}</h1>
      )}

      <div className={headerStyles.note}>
        <span className={headerStyles.header}>Voting Guide Note</span>
        {noteState === NoteState.View && (
          <>
            <div className={headerStyles.noteText}>{note}</div>
            {isGuideOwner && (
              <Button
                label="Edit note"
                onClick={() => setNoteState(NoteState.Edit)}
                variant="secondary"
                size="medium"
              />
            )}
          </>
        )}
        {noteState === NoteState.Edit && (
          <>
            <div>
              <textarea
                value={note || ""}
                onChange={(e) => setNote(e.target.value)}
              />

              <div className={headerStyles.buttonArea}>
                <Button
                  label="Save note"
                  onClick={() => alert("save note")}
                  variant="secondary"
                  size="medium"
                />
                <Button
                  label="Cancel"
                  onClick={() => {
                    setNote(initialNote);
                    setNoteState(NoteState.View);
                  }}
                  variant="secondary"
                  size="medium"
                />
              </div>
            </div>
          </>
        )}
      </div>
    </section>
  );
}

export default HeaderSection;
