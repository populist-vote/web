import { Avatar } from "components/Avatar/Avatar";
import { LeftArrowIcon } from "components/Icons";
import { useVotingGuide } from "hooks/useVotingGuide";
import { useRouter } from "next/router";
import { PERSON_FALLBACK_IMAGE_URL } from "utils/constants";
import styles from "./VotingGuideNav.module.scss";

function VotingGuideNav() {
  const { guideAuthor } = useVotingGuide();
  const router = useRouter();

  if (!guideAuthor.name) return null;

  return (
    <nav className={styles.topBar}>
      <button className={styles.iconButton} onClick={() => router.back()}>
        <LeftArrowIcon />
      </button>

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
      <div className={styles.placeholder} />
    </nav>
  );
}

export { VotingGuideNav };
