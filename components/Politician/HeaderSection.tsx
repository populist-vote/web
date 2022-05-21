import { Button, PartyAvatar } from "components";

import styles from "styles/page.module.scss";

import headerStyles from "./HeaderSection.module.scss"

import { default as classNames } from "classnames"

import {
  PoliticianResult,
} from "../../generated";

import {
  PERSON_FALLBACK_IMAGE_URL
} from "utils/constants";

function HeaderSection({
  politician
}: {
  politician: Partial<PoliticianResult>
}) {

  const sectionCx = classNames(styles.center, headerStyles.headerSection)
  return (
    <section className={sectionCx}>
      <PartyAvatar
        badgeSize={"3.125rem"}
        badgeFontSize={"1.5rem"}
        size={200}
        party={politician?.party || ("UNKNOWN" as PoliticalParty)}
        src={
          (politician?.thumbnailImageUrl ||
            politician?.votesmartCandidateBio?.candidate.photo) as string
        }
        fallbackSrc={PERSON_FALLBACK_IMAGE_URL}
        alt={politician?.fullName as string}
      />
      <Button label="Add note" onClick={() => {}} primary large>
        Add note
      </Button>
    </section>
  );
}

export default HeaderSection