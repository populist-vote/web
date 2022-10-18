import classNames from "classnames";
import { Avatar } from "components/Avatar/Avatar";
import { LeftArrowIcon } from "components/Icons";
import { useScrollPosition } from "hooks/useScrollPosition";
import { useVotingGuide } from "hooks/useVotingGuide";
import Link from "next/link";
import { useState } from "react";
import { PERSON_FALLBACK_IMAGE_URL } from "utils/constants";
import styles from "./VotingGuideNav.module.scss";

function VotingGuideNav() {
  const { guideAuthor } = useVotingGuide();
  const [sticky, setSticky] = useState<boolean>(true);

  useScrollPosition(
    ({
      prevPos,
      currPos,
    }: {
      prevPos: { y: number };
      currPos: { y: number };
    }) => {
      // hack because safari thinks its cool to have a bouncy effect and allow scroll position to exceed 0
      let prevPosY = prevPos.y;
      if (prevPosY > 0) {
        prevPosY = 0;
      }
      const isShow = currPos.y >= prevPosY;
      if (isShow !== sticky) setSticky(isShow);
    },
    [sticky]
  );

  const navStyles = classNames(styles.topBar, {
    [styles.sticky as string]: sticky,
  });

  return (
    <nav className={navStyles}>
      <div className={styles.backButton}>
        <Link href="/voting-guides" passHref>
          <div>
            <LeftArrowIcon height={30} />
          </div>
        </Link>
      </div>
      <div className={styles.votingGuideAuthor}>
        <Avatar
          src={
            (guideAuthor.profilePictureUrl ||
              PERSON_FALLBACK_IMAGE_URL) as string
          }
          size={40}
          alt={guideAuthor.name}
        />
        <span>By {guideAuthor.name}</span>
      </div>
      <div />
    </nav>
  );
}

export { VotingGuideNav };
