import { Avatar } from "components/Avatar/Avatar";
import { useVotingGuide } from "hooks/useVotingGuide";
import Link from "next/link";
import { FaChevronLeft } from "react-icons/fa";
import { PERSON_FALLBACK_IMAGE_URL } from "utils/constants";
import styles from "./VotingGuideNav.module.scss";

function VotingGuideNav() {
  const { isGuideOwner, guideAuthor } = useVotingGuide();

  if (isGuideOwner) return null;

  return (
    <nav className={styles.topBar}>
      <Link href="/voting-guides" passHref>
        <div>
          <FaChevronLeft />
        </div>
      </Link>

      <div className={styles.votingGuideAuthor}>
        <Avatar
          src={
            (guideAuthor.profilePictureUrl ||
              PERSON_FALLBACK_IMAGE_URL) as string
          }
          size={30}
          alt={guideAuthor.name}
        />
        <span>By {guideAuthor.name}</span>
      </div>
      <div />
    </nav>
  );
}

export { VotingGuideNav };
