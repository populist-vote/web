import { PartyAvatar } from "components";
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
  const sectionCx = classNames(
    styles.center,
    styles.borderBottom,
    headerStyles.headerSection
  );

  const { isMobile } = useDeviceInfo();
  return (
    <section className={sectionCx}>
      <PartyAvatar
        key={politician?.id}
        badgeSize={"3.125rem"}
        badgeFontSize={"2rem"}
        size={200}
        party={politician?.party as PoliticalParty}
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
    </section>
  );
}

export default HeaderSection;
