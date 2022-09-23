import styles from "styles/modules/page.module.scss";
import electionStyles from "./ElectionInfo.module.scss";
import { PartyAvatar } from "components";
import layoutStyles from "../../components/Layout/Layout.module.scss";
import states from "utils/states";
import { PERSON_FALLBACK_IMAGE_URL } from "utils/constants";
import {
  District,
  ElectionScope,
  PoliticalParty,
  PoliticianResult,
} from "../../generated";
import { dateString } from "utils/dates";
import classNames from "classnames";
import dynamic from "next/dynamic";

const Scroller = dynamic(() => import("components/Scroller/Scroller"), {
  ssr: false,
});

function Candidate({
  candidate,
}: {
  candidate: Partial<PoliticianResult>;
  itemId: string;
}) {
  return (
    <div className={layoutStyles.avatarContainer} key={candidate.id}>
      <PartyAvatar
        size={60}
        party={candidate.party as PoliticalParty}
        src={candidate.thumbnailImageUrl || PERSON_FALLBACK_IMAGE_URL}
        fallbackSrc={PERSON_FALLBACK_IMAGE_URL}
        alt={candidate?.fullName || ""}
        href={`/politicians/${candidate.slug}`}
      />
      <span className={classNames(layoutStyles.link, styles.avatarName)}>
        {candidate.fullName}
      </span>
    </div>
  );
}

function ElectionInfoSection({
  politician,
}: {
  politician: Partial<PoliticianResult>;
}) {
  const { upcomingRace } = politician;
  const opponents =
    upcomingRace?.candidates?.filter(
      (candidate) => candidate.id != politician.id
    ) || [];
  if (!upcomingRace) return null;

  const sectionCx = classNames(
    styles.center,
    styles.borderTop,
    electionStyles.wrapper
  );

  let officeSubheader = "";
  let stateLong = "";

  if (upcomingRace?.office.state) {
    stateLong = states[upcomingRace.office.state];
  }

  // TODO add subtitle_short to API
  switch (upcomingRace?.office.electionScope) {
    case ElectionScope.National:
      break;
    case ElectionScope.State:
      officeSubheader = stateLong;
      break;
    case ElectionScope.District:
      switch (upcomingRace?.office.districtType) {
        case District.UsCongressional:
          officeSubheader =
            upcomingRace.office.state +
            " District " +
            upcomingRace?.office.district;
          break;
        case District.StateSenate:
          officeSubheader = stateLong + " SD " + upcomingRace?.office.district;
          break;
        case District.StateHouse:
          officeSubheader = stateLong + " HD " + upcomingRace?.office.district;
      }
  }

  return (
    <section className={sectionCx}>
      <div>
        <h4 className={styles.subHeader}>Next Election</h4>
        <div className={`${styles.roundedCard} ${electionStyles.box}`}>
          <h3>{upcomingRace?.raceType}</h3>
          <h2>{dateString(upcomingRace?.electionDate, true)}</h2>
        </div>
      </div>
      <div>
        <h4 className={styles.subHeader}>Running For</h4>
        <div className={`${styles.roundedCard} ${electionStyles.box}`}>
          <h3>{officeSubheader}</h3>
          <h2>{upcomingRace?.office.name}</h2>
        </div>
      </div>
      <div>
        <h4 className={styles.subHeader}>
          Opponent{opponents.length > 1 && "s"}
        </h4>
        <div className={`${styles.roundedCard} ${electionStyles.boxOpponent}`}>
          {opponents.length == 0 ? (
            <h3>None</h3>
          ) : (
            <Scroller>
              {opponents.map(
                (candidate: Partial<PoliticianResult> & { id: string }) => {
                  return (
                    <Candidate
                      candidate={candidate}
                      itemId={candidate.id}
                      key={candidate.id}
                    />
                  );
                }
              )}
            </Scroller>
          )}
        </div>
      </div>
    </section>
  );
}

export { ElectionInfoSection };
