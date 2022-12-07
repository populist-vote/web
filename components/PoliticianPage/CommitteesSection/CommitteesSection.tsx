import clsx from "clsx";
import { GetCandidateBioResponse } from "generated";
import dynamic from "next/dynamic";
import { FaChair } from "react-icons/fa";
import { GrTree } from "react-icons/gr";
import styles from "./CommitteesSection.module.scss";

const Scroller = dynamic(() => import("components/Scroller/Scroller"), {
  ssr: false,
});

type TagType = {
  text: string;
  fullText?: string;
  isChair?: boolean;
  isSubCommittee?: boolean;
};

function CommitteeTagPage({ tags }: { tags: Array<TagType>; itemId: string }) {
  return (
    <div className={styles.tagPage}>
      {tags.map((tag, index) => (
        <CommitteeTag tag={tag} key={`${tag}${index}`} />
      ))}
    </div>
  );
}

export function CommitteeTag({ tag }: { tag: TagType }) {
  return (
    <div className={styles.tag} title={tag.fullText}>
      {tag.isChair && <FaChair color="var(--blue)" />}
      {tag.isSubCommittee && (
        <GrTree className={styles.subCommittee} color="var(--blue)" />
      )}
      <span>{tag.text}</span>
    </div>
  );
}

function CommitteesSection({
  votesmartCandidateBio,
}: {
  votesmartCandidateBio: GetCandidateBioResponse;
}) {
  const politicalExperience =
    votesmartCandidateBio?.candidate?.congMembership?.experience;

  // Votesmart data is very poorly typed, sometimes we get a string here so we need this check
  const tags =
    politicalExperience?.constructor === Array
      ? politicalExperience.map(
          (committee: {
            organization: string;
            title?: string;
            fullText: string;
          }) => ({
            text: committee?.organization
              ?.replace("Subcommittee on", "")
              .replace(", United States Senate", ""),
            fullText: committee?.fullText,
            isChair: committee?.title?.toUpperCase().indexOf("CHAIR") !== -1,
            isSubCommittee:
              committee?.organization?.toUpperCase().indexOf("SUBCOMMITTEE") !==
              -1,
          })
        )
      : [];
  const TAG_PAGE_SIZE = 4;
  const tagPages: Array<Array<TagType>> = Array(
    Math.ceil(tags.length / TAG_PAGE_SIZE)
  )
    .fill("")
    .map((_, index) => index * TAG_PAGE_SIZE)
    .map((begin) => tags?.slice(begin, begin + TAG_PAGE_SIZE));

  if (tags.length === 0) return null;
  const cx = clsx(styles.center, styles.committees, styles.borderTop);
  return (
    <section className={cx}>
      <h4 className={styles.subHeader}>Committees</h4>
      <div className={styles.sectionContent}>
        <Scroller onePageAtATime>
          {tagPages.map((tagPage, index) => (
            <CommitteeTagPage
              tags={tagPage}
              key={`tagPage-${index}`}
              itemId={`tagPage-${index}`}
            />
          ))}
        </Scroller>
      </div>
    </section>
  );
}

export { CommitteesSection };
