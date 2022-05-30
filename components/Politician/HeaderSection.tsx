import { Button, PartyAvatar } from "components";

import styles from "styles/page.module.scss";

import headerStyles from "./HeaderSection.module.scss";

import { default as classNames } from "classnames";

import useDeviceInfo from "hooks/useDeviceInfo";

import { PoliticalParty, PoliticianResult } from "../../generated";

import { PERSON_FALLBACK_IMAGE_URL } from "utils/constants";

function HeaderSection({
  politician,
}: {
  politician: Partial<PoliticianResult>;
}) {
  const sectionCx = classNames(styles.center, headerStyles.headerSection);

  const { isMobile } = useDeviceInfo();
  return (
    <section className={sectionCx}>
      <PartyAvatar
        badgeSize={"3.125rem"}
        badgeFontSize={"2rem"}
        size={200}
        party={politician?.party || ("UNKNOWN" as PoliticalParty)}
        src={
          (politician?.thumbnailImageUrl ||
            politician?.votesmartCandidateBio?.candidate.photo) as string
        }
        fallbackSrc={PERSON_FALLBACK_IMAGE_URL}
        alt={politician?.fullName as string}
      />
      {!isMobile && (
        <h1 className={headerStyles.fullName}>{politician?.fullName}</h1>
      )}
      {false ? (
        <Button id="add-note-btn" label={"Add note"} primary large theme="blue">
          Add note
        </Button>
      ) : (
        <div className={headerStyles.note}>
          <div className={headerStyles.header}>Voting Guide Note</div>
          <div className={headerStyles.noteText}>
            It is something I have been posting for a few weeks – I usually
            adjust the statement to whatever the post is related to. I have been
            getting a laugh out of doing it and other people have seemed to
            enjoy it too – Anyway – since this is my post and I have been going
            around making variations of this comment people are now showing up
            here on my post with their own variations of the comment. I hope
            that clarifies things…. but please do not let this extensive
            clarification distract you from the fact that in 1998, The
            Undertaker threw Mankind off Hell In A Cell, and plummeted 16 ft
            through an announcer's table."
          </div>
          <Button
            id="edit-note-btn"
            label={"Edit note"}
            secondary
            large
            theme="blue"
          >
            Edit note
          </Button>
        </div>
      )}
    </section>
  );
}

export default HeaderSection;
