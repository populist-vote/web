/* eslint-disable jsx-a11y/no-static-element-interactions */
import { FieldSet, VotingGuideNote, PartyAvatar } from "components";
import {
  PoliticalParty,
  PoliticianResult,
  RaceResult,
  RaceType,
  useUpsertVotingGuideCandidateMutation,
  VotingGuideByIdQuery,
} from "generated";
import { useVotingGuide } from "hooks/useVotingGuide";
import { useEffect, useMemo, useRef, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import styles from "./Ballot.module.scss";
import { AtLeast } from "types/global";

import { default as clsx } from "clsx";
import { FaCheckCircle, FaCircle } from "react-icons/fa";
import Divider from "components/Divider/Divider";
import Link from "next/link";

interface EditVotingGuideCandidate {
  candidateId: string;
  isEndorsement?: boolean;
  note?: string | null;
}

function Race({
  race,
  theme = "dark",
  isEmbedded = false,
}: {
  race: RaceResult;
  itemId: string;
  theme?: "light" | "dark";
  isEmbedded?: boolean;
}) {
  const queryClient = useQueryClient();

  const { data: votingGuide, isGuideOwner, queryKey } = useVotingGuide();

  const invalidateVotingGuideQuery = () =>
    queryClient.invalidateQueries({ queryKey });

  const upsertVotingGuideCandidate = useUpsertVotingGuideCandidateMutation({
    onMutate: async (newVotingGuideCandidate) => {
      await queryClient.cancelQueries({ queryKey });
      const previousVotingGuide =
        queryClient.getQueryData<VotingGuideByIdQuery>(queryKey);

      if (previousVotingGuide) {
        queryClient.setQueryData<VotingGuideByIdQuery>(
          queryKey,
          (oldGuideQuery) => {
            if (oldGuideQuery) {
              const optimisticNewGuide = {
                votingGuideById: {
                  ...oldGuideQuery.votingGuideById,
                  candidates: [
                    ...oldGuideQuery.votingGuideById.candidates.map((c) => {
                      if (
                        c?.politician?.id ===
                        newVotingGuideCandidate.candidateId
                      ) {
                        return {
                          ...c,
                          ...(newVotingGuideCandidate as EditVotingGuideCandidate),
                          note: c.note,
                        };
                      }
                      return c;
                    }),
                  ],
                },
              };

              return optimisticNewGuide;
            }
          }
        );
      }

      return { previousVotingGuide };
    },
    onError: (err, newVotingGuide, context) => {
      if (context?.previousVotingGuide) {
        queryClient.setQueryData(queryKey, context?.previousVotingGuide);
      }
    },
    onSuccess: () => invalidateVotingGuideQuery(),
  });

  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogCandidate, setDialogCandidate] = useState<AtLeast<
    PoliticianResult,
    "id"
  > | null>(null);

  const editVotingGuideCandidate = ({
    candidateId,
    isEndorsement,
    note,
  }: EditVotingGuideCandidate) => {
    upsertVotingGuideCandidate.mutate({
      votingGuideId: votingGuide.id,
      candidateId,
      isEndorsement,
      note,
    });
  };

  const endorseCandidate = (candidateId: string) =>
    editVotingGuideCandidate({ candidateId, isEndorsement: true });

  const unendorseCandidate = (candidateId: string) =>
    editVotingGuideCandidate({ candidateId, isEndorsement: false });

  const handleAddNoteClick = (politician: AtLeast<PoliticianResult, "id">) => {
    setDialogCandidate(politician);
    setDialogOpen(true);
  };

  const { raceType, party, candidates, results } = race;

  const incumbentIds = race?.office?.incumbents?.map((i) => i.id) || [];

  const sortedCandidates = useMemo(() => {
    const randomizeFn = () => Math.random() - 0.5;

    const incumbentSortFn = (a: PoliticianResult, b: PoliticianResult) =>
      incumbentIds?.includes(a.id) && !incumbentIds.includes(b.id) ? -1 : 1;

    const partySortFn = (a: PoliticianResult, b: PoliticianResult) =>
      (a.party?.name === "Democratic" && b.party?.name !== "Democratic") ||
      (a.party?.name === "Republican" && b.party?.name !== "Republican")
        ? -1
        : 1;

    const electionResultsSortFn = (
      a: PoliticianResult,
      b: PoliticianResult
    ) => {
      const votePercentageA =
        results?.votesByCandidate.find((c) => c.candidateId === a.id)
          ?.votePercentage || 0;
      const votePercentageB =
        results?.votesByCandidate.find((c) => c.candidateId === b.id)
          ?.votePercentage || 0;
      return votePercentageA > votePercentageB ? -1 : 1;
    };

    return candidates
      ?.sort(randomizeFn)
      .sort(partySortFn)
      .sort(electionResultsSortFn)
      .sort(incumbentSortFn);
  }, []);

  const $raceContent = (
    <>
      {candidates.length < 1 && (
        <h4 className={styles.noCandidates}>No candidates</h4>
      )}
      {dialogCandidate && (
        <VotingGuideNote
          key={dialogCandidate?.id}
          politician={dialogCandidate}
          editVotingGuideCandidate={editVotingGuideCandidate}
          isOpen={dialogOpen}
          handleClose={() => setDialogOpen(false)}
        />
      )}
      <ScrollableContainer avatarWidth={124}>
        {sortedCandidates.map((politician: PoliticianResult) => {
          const isEndorsing = votingGuide?.candidates
            ?.filter((c) => c.isEndorsement)
            .map((c) => c.politician.id)
            .includes(politician.id);

          const hasNote = votingGuide?.candidates
            ?.filter((c) => c.note?.length)
            .map((c) => c.politician.id)
            .includes(politician.id);

          const appendString = votingGuide?.id
            ? `?votingGuideId=${votingGuide.id}`
            : "";

          const politicianLink = `/politicians/${encodeURIComponent(
            politician?.slug
          )}${appendString}`;

          const votePercentage = results?.votesByCandidate.find(
            (c) => c.candidateId === politician.id
          )?.votePercentage;

          const isWinner = results?.winners
            ?.map((w) => w.id)
            .includes(politician.id);

          const isOpaque = !!results?.winners && !isWinner;

          const labelLeftProps = {
            text: votePercentage ? `${votePercentage}%` : null,
            background: "var(--grey-lighter)",
            color: "var(--grey-darkest)",
            icon: isWinner ? (
              <span className={styles.iconStack}>
                <FaCircle color="black" />
                <FaCheckCircle color="var(--green-support)" />
              </span>
            ) : null,
          };

          return (
            <div
              className={styles.flexBetween}
              style={{ height: "auto" }}
              key={politician.id}
            >
              {incumbentIds?.includes(politician.id) &&
                (theme == "dark" ? (
                  <span className={styles.sideText}>INCUMBENT</span>
                ) : (
                  <span
                    className={styles.sideText}
                    style={{ color: "var(--grey)" }}
                  >
                    INCUMBENT
                  </span>
                ))}

              <Link
                className={styles.avatarContainer}
                href={politicianLink}
                target={isEmbedded ? "_blank" : undefined}
              >
                <PartyAvatar
                  theme={theme}
                  size={80}
                  hasIconMenu
                  isEndorsement={isEndorsing}
                  iconSize="1.25rem"
                  hasNote={hasNote}
                  iconType={isEndorsing ? "star" : hasNote ? "note" : "plus"}
                  handleEndorseCandidate={() => endorseCandidate(politician.id)}
                  handleUnendorseCandidate={() =>
                    unendorseCandidate(politician.id)
                  }
                  handleAddNote={() => handleAddNoteClick(politician)}
                  party={politician?.party as PoliticalParty}
                  src={politician?.assets?.thumbnailImage160 as string}
                  alt={politician.fullName}
                  readOnly={!isGuideOwner}
                  href={politicianLink}
                  target={isEmbedded ? "_blank" : undefined}
                  rel={isEmbedded ? "noopener noreferrer" : undefined}
                  labelLeft={labelLeftProps}
                  opaque={isOpaque}
                />
                <span className={clsx(styles.link, styles.avatarName)}>
                  {politician.fullName}
                </span>
              </Link>

              {incumbentIds?.includes(politician.id) &&
                candidates?.length > 1 &&
                (theme == "dark" ? (
                  <Divider vertical />
                ) : (
                  <Divider vertical color="var(--grey-light)" />
                ))}
            </div>
          );
        })}
      </ScrollableContainer>
    </>
  );

  return raceType === RaceType.General ? (
    <div className={clsx(styles.raceContent)}>{$raceContent}</div>
  ) : (
    <FieldSet
      heading={raceType}
      color={
        party?.fecCode === "REP"
          ? "red"
          : party?.fecCode === "DEM"
            ? "blue"
            : "violet"
      }
    >
      {$raceContent}
    </FieldSet>
  );
}

interface ScrollableContainerProps {
  children: React.ReactNode;
  avatarWidth: number; // Width of each avatar in pixels
}

function ScrollableContainer({
  children,
  avatarWidth,
}: ScrollableContainerProps) {
  const [hiddenCountLeft, setHiddenCountLeft] = useState(0);
  const [hiddenCountRight, setHiddenCountRight] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;

      const { scrollLeft, scrollWidth, clientWidth } = containerRef.current;

      const leftHidden = Math.floor(scrollLeft / avatarWidth);
      const rightHidden = Math.floor(
        (scrollWidth - scrollLeft - clientWidth) / avatarWidth
      );

      setHiddenCountLeft(leftHidden);
      setHiddenCountRight(rightHidden);
    };

    const handleResize = () => {
      handleScroll(); // Recalculate counts on resize
    };

    handleScroll(); // Initial calculation on mount

    containerRef.current?.addEventListener("scroll", handleScroll);
    window.addEventListener("resize", handleResize);

    return () => {
      containerRef.current?.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
    };
  }, [avatarWidth]);

  const handleScrollLeft = () => {
    if (!containerRef.current) return;

    containerRef.current.scrollBy({
      left: -avatarWidth,
      behavior: "smooth",
    });
  };

  const handleScrollRight = () => {
    if (!containerRef.current) return;

    containerRef.current.scrollBy({
      left: avatarWidth,
      behavior: "smooth",
    });
  };

  return (
    <div className={styles.scrollableContainer}>
      {/* Left indicator */}
      {hiddenCountLeft > 0 && (
        <div
          className={styles.hiddenIndicatorLeft}
          onClick={handleScrollLeft}
          onKeyDown={handleScrollRight}
        >
          +{hiddenCountLeft}
        </div>
      )}

      {/* Content container */}
      <div className={styles.scrollContent} ref={containerRef}>
        {children}
      </div>

      {/* Right indicator */}
      {hiddenCountRight > 0 && (
        <div
          className={styles.hiddenIndicatorRight}
          onClick={handleScrollRight}
          onKeyDown={handleScrollRight}
        >
          +{hiddenCountRight}
        </div>
      )}
    </div>
  );
}

export type { EditVotingGuideCandidate };
export { Race };
