import {
  FieldSet,
  VotingGuideNote,
  PartyAvatar,
  VerticalDivider,
} from "components";
import {
  PoliticalParty,
  PoliticianResult,
  RaceResult,
  RaceType,
  useUpsertVotingGuideCandidateMutation,
  VotingGuideByIdQuery,
} from "generated";
import { useVotingGuide } from "hooks/useVotingGuide";
import { useMemo, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import styles from "./Ballot.module.scss";
import { AtLeast } from "types/global";

import { default as clsx } from "clsx";
import { FaCheckCircle, FaCircle } from "react-icons/fa";

interface EditVotingGuideCandidate {
  candidateId: string;
  isEndorsement?: boolean;
  note?: string | null;
}

function Race({
  race,
  incumbentId,
  theme = "dark",
}: {
  race: RaceResult;
  itemId: string;
  incumbentId?: string;
  theme?: "light" | "dark";
}) {
  const queryClient = useQueryClient();

  const { data: votingGuide, isGuideOwner, queryKey } = useVotingGuide();

  const invalidateVotingGuideQuery = () =>
    queryClient.invalidateQueries(queryKey);

  const upsertVotingGuideCandidate = useUpsertVotingGuideCandidateMutation({
    onMutate: async (newVotingGuideCandidate) => {
      await queryClient.cancelQueries(queryKey);
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

  const sortedCandidates = useMemo(() => {
    const randomizeFn = () => Math.random() - 0.5;

    const incumbentSortFn = (a: PoliticianResult, b: PoliticianResult) =>
      a.id === incumbentId && b.id !== incumbentId ? -1 : 1;

    const partySortFn = (a: PoliticianResult, b: PoliticianResult) =>
      (a.party === PoliticalParty.Democratic &&
        b.party !== PoliticalParty.Democratic) ||
      (a.party === PoliticalParty.Republican &&
        b.party !== PoliticalParty.Republican)
        ? -1
        : 1;

    const electionResultsSortFn = (
      a: PoliticianResult,
      b: PoliticianResult
    ) => {
      const votePercentageA =
        results.votesByCandidate.find((c) => c.candidateId === a.id)
          ?.votePercentage || 0;
      const votePercentageB =
        results.votesByCandidate.find((c) => c.candidateId === b.id)
          ?.votePercentage || 0;
      return votePercentageA > votePercentageB ? -1 : 1;
    };

    return candidates
      ?.sort(randomizeFn)
      .sort(partySortFn)
      .sort(incumbentSortFn)
      .sort(electionResultsSortFn);
  }, [candidates, incumbentId, results.votesByCandidate]);

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

        const votePercentage = results.votesByCandidate.find(
          (c) => c.candidateId === politician.id
        )?.votePercentage;

        const isWinner = results?.winners
          ?.map((w) => w.id)
          .includes(politician.id);

        const isOpaque = !!results.winners && !isWinner;

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
          <div className={styles.flexBetween} key={politician.id}>
            {politician.id == incumbentId && (
              <span className={styles.sideText}>INCUMBENT</span>
            )}

            <div className={styles.avatarContainer}>
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
                labelLeft={labelLeftProps}
                opaque={isOpaque}
              />
              <span className={clsx(styles.link, styles.avatarName)}>
                {politician.fullName}
              </span>
            </div>

            {politician.id == incumbentId && candidates?.length > 1 && (
              <VerticalDivider />
            )}
          </div>
        );
      })}
    </>
  );

  return raceType === RaceType.General ? (
    <div className={clsx(styles.raceContent, styles.scrollSnap)}>
      {$raceContent}
    </div>
  ) : (
    <FieldSet
      heading={raceType}
      color={party === PoliticalParty.Republican ? "red" : "blue"}
      className={clsx(styles.scrollSnap)}
    >
      {$raceContent}
    </FieldSet>
  );
}

export type { EditVotingGuideCandidate };
export { Race };
