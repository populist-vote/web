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
  useUpsertVotingGuideCandidateMutation,
  VotingGuideByIdQuery,
} from "generated";
import { useVotingGuide } from "hooks/useVotingGuide";
import { useState } from "react";
import { useQueryClient } from "react-query";
import styles from "components/Layout/Layout.module.scss";
import ballotStyles from "pages/ballot/Ballot.module.scss";
import { AtLeast } from "types/global";
import Link from "next/link";

import { default as classNames } from "classnames";

interface EditVotingGuideCandidate {
  candidateId: string;
  isEndorsement?: boolean;
  note?: string | null;
}

function Race({
  race,
  itemId,
  incumbentId,
}: {
  race: RaceResult;
  itemId: string;
  incumbentId?: string;
}) {
  const queryClient = useQueryClient();

  const candidateSortFn = (a: PoliticianResult, b: PoliticianResult) =>
    a.id === incumbentId && b.id !== incumbentId ? -1 : 1;

  const { data: votingGuide, isGuideOwner, queryKey } = useVotingGuide();

  const invalidateVotingGuideQuery = () =>
    queryClient.invalidateQueries(queryKey);

  const upsertVotingGuideCandidate = useUpsertVotingGuideCandidateMutation({
    // @ts-ignore - this is tricky to type properly
    onMutate: async (newVotingGuideCandidate: EditVotingGuideCandidate) => {
      await queryClient.cancelQueries(queryKey);
      const previousVotingGuide =
        queryClient.getQueryData<VotingGuideByIdQuery>(queryKey);

      if (previousVotingGuide) {
        queryClient.setQueryData<VotingGuideByIdQuery>(
          queryKey,
          // @ts-ignore
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

  return (
    <div itemID={itemId}>
      <FieldSet
        heading={raceType}
        color={party === PoliticalParty.Republican ? "red" : "blue"}
      >
        {candidates.length < 1 && (
          <h4 className={ballotStyles.noCandidates}>No candidates</h4>
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
        {candidates
          ?.sort(candidateSortFn)
          ?.map((politician: PoliticianResult) => {
            const isEndorsing = votingGuide?.candidates
              ?.filter((c) => c.isEndorsement)
              .map((c) => c.politician.id)
              .includes(politician.id);

            const hasNote = votingGuide?.candidates
              ?.filter((c) => c.note?.length)
              .map((c) => c.politician.id)
              .includes(politician.id);

            const appendString = votingGuide?.id
              ? `?voting-guide=${votingGuide.id}`
              : "";

            const politicianLink = `/politicians/${encodeURIComponent(
              politician?.slug
            )}${appendString}`;

            const votePercentage =
              results.votesByCandidate.find(
                (c) => c.candidateId === politician.id
              )?.votePercentage + "%";

            const labelLeftProps = {
              text: votePercentage,
              background: "var(--grey-lighter)",
              color: "var(--grey-darker)",
            };

            return (
              <div
                className={styles.flexBetween}
                key={politician.id}
                style={{ height: "8rem" }}
              >
                {politician.id == incumbentId && (
                  <span className={ballotStyles.sideText}>INCUMBENT</span>
                )}

                <div className={styles.avatarContainer}>
                  <PartyAvatar
                    size={80}
                    hasIconMenu
                    isEndorsement={isEndorsing}
                    iconSize="1.25rem"
                    hasNote={hasNote}
                    iconType={isEndorsing ? "star" : hasNote ? "note" : "plus"}
                    handleEndorseCandidate={() =>
                      endorseCandidate(politician.id)
                    }
                    handleUnendorseCandidate={() =>
                      unendorseCandidate(politician.id)
                    }
                    handleAddNote={() => handleAddNoteClick(politician)}
                    party={politician?.party as PoliticalParty}
                    src={politician?.thumbnailImageUrl as string}
                    alt={politician.fullName}
                    readOnly={!isGuideOwner}
                    href={politicianLink}
                    labelLeft={labelLeftProps}
                    opaque={results && results.winner?.id !== politician.id}
                  />
                  <Link href={politicianLink} passHref>
                    <span
                      className={classNames(styles.link, styles.avatarName)}
                    >
                      {politician.fullName}
                    </span>
                  </Link>
                </div>

                {politician.id == incumbentId && candidates?.length > 1 && (
                  <VerticalDivider />
                )}
              </div>
            );
          })}
      </FieldSet>
    </div>
  );
}

export type { EditVotingGuideCandidate };
export { Race };
