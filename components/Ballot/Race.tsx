import { FieldSet } from "components/FieldSet/FieldSet";
import { VotingGuideNote } from "components/VotingGuide/VotingGuideNote/VotingGuideNote";
import {
  PoliticalParty,
  PoliticianResult,
  RaceResult,
  useUpsertVotingGuideCandidateMutation,
} from "generated";
import { useVotingGuide } from "hooks/useVotingGuide";
import { useState } from "react";
import { useQueryClient } from "react-query";
import styles from "components/Layout/Layout.module.scss";
import { PartyAvatar } from "components/Avatar/Avatar";
import { VerticalDivider } from "components/VerticalDivider/VerticalDivider";
import { AtLeast } from "types/global";
import Link from "next/link";

export interface EditVotingGuideCandidate {
  candidateId: string;
  isEndorsement?: boolean;
  note?: string | null;
  onSuccess?: () => void;
}

export default function Race({
  race,
  itemId,
  incumbentId,
}: {
  race: RaceResult;
  itemId: string;
  incumbentId?: string;
}) {
  const candidateSortFn = (a: PoliticianResult, b: PoliticianResult) =>
    a.id === incumbentId && b.id !== incumbentId ? -1 : 1;
  const { data: votingGuide, isGuideOwner, queryKey } = useVotingGuide();
  const queryClient = useQueryClient();
  const invalidateVotingGuideQuery = () =>
    queryClient.invalidateQueries(queryKey);
  const upsertVotingGuideCandidate = useUpsertVotingGuideCandidateMutation();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogCandidate, setDialogCandidate] = useState<AtLeast<
    PoliticianResult,
    "id"
  > | null>(null);

  const editVotingGuideCandidate = ({
    candidateId,
    isEndorsement,
    note,
    onSuccess,
  }: EditVotingGuideCandidate) => {
    upsertVotingGuideCandidate.mutate(
      {
        votingGuideId: votingGuide.id,
        candidateId,
        isEndorsement,
        note,
      },
      {
        onSuccess: () => {
          invalidateVotingGuideQuery().catch((err) =>
            console.error("Problem invalidating query", err)
          );
          if (onSuccess) onSuccess();
        },
      }
    );
  };

  const endorseCandidate = (candidateId: string, race: RaceResult) => {
    console.log("endorsing...", candidateId, race.candidates);
    editVotingGuideCandidate({
      candidateId,
      isEndorsement: true,
      onSuccess: () => console.log("endorsement successful", candidateId),
    });
    race.candidates.forEach((c) => {
      if (c.id !== candidateId) {
        console.log("unendorse this foooo");
        unendorseCandidate(c.id);
      }
    }); //auto unendorse others in race
  };

  const unendorseCandidate = (candidateId: string) => {
    console.log("unendorsing...", candidateId);
    editVotingGuideCandidate({
      candidateId,
      isEndorsement: false,
      onSuccess: () => console.log("unendior succccc", candidateId),
    });
  };

  const handleAddNoteClick = (politician: AtLeast<PoliticianResult, "id">) => {
    setDialogCandidate(politician);
    setDialogOpen(true);
  };

  return (
    <div itemID={itemId}>
      <FieldSet
        heading={race.title}
        color={race.party === PoliticalParty.Republican ? "red" : "blue"}
      >
        {race.candidates.length < 1 && (
          <h3 style={{ color: "var(--blue-lighter)" }}>
            No official candidates
          </h3>
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
        {race.candidates
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

            return (
              <div
                className={styles.flexBetween}
                key={politician.id}
                style={{ height: "9rem" }}
              >
                {politician.id == incumbentId && (
                  <span className={styles.sideText}>INCUMBENT</span>
                )}

                <div className={styles.avatarContainer}>
                  <PartyAvatar
                    size={80}
                    hasIconMenu
                    isEndorsement={isEndorsing}
                    hasNote={hasNote}
                    iconType={isEndorsing ? "star" : hasNote ? "note" : "plus"}
                    handleEndorseCandidate={
                      politician.upcomingRace
                        ? () => {
                            console.log(
                              "endorse",
                              politician.id,
                              politician.upcomingRace
                            );
                            endorseCandidate(
                              politician.id,
                              politician.upcomingRace as RaceResult
                            );
                          }
                        : () =>
                            console.error(
                              "Can't endorse a candidate without an upcoming race"
                            )
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
                  />
                  <Link href={politicianLink} passHref>
                    <h4 className={styles.link}>{politician.fullName}</h4>
                  </Link>
                </div>

                {politician.id == incumbentId &&
                  race.candidates?.length > 1 && <VerticalDivider />}
              </div>
            );
          })}
      </FieldSet>
    </div>
  );
}
