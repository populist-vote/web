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
import { Menu, MenuItem, MenuButton } from "@szhsin/react-menu";
import "@szhsin/react-menu/dist/index.css";
import "@szhsin/react-menu/dist/transitions/slide.css";
import { PartyAvatar } from "components/Avatar/Avatar";
import { VerticalDivider } from "components/VerticalDivider/VerticalDivider";

export default function Race({
  race,
  itemId,
  incumbentId,
}: {
  race: RaceResult;
  itemId: string;
  incumbentId: string | undefined;
}) {
  const candidateSortFn = (a: PoliticianResult, b: PoliticianResult) =>
    a.id === incumbentId && b.id !== incumbentId ? -1 : 1;
  const { data: votingGuide, queryKey } = useVotingGuide();
  const queryClient = useQueryClient();
  const invalidateVotingGuideQuery = () =>
    queryClient.invalidateQueries(queryKey);
  const upsertVotingGuideCandidate = useUpsertVotingGuideCandidateMutation();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogCandidate, setDialogCandidate] =
    useState<Partial<PoliticianResult> | null>(null);

  const editVotingGuideCandidate = (
    candidateId: string,
    isEndorsement: boolean,
    note?: string
  ) => {
    upsertVotingGuideCandidate.mutate(
      {
        votingGuideId: votingGuide.id,
        candidateId,
        isEndorsement,
        note,
      },
      {
        onSuccess: () => invalidateVotingGuideQuery(),
      }
    );
  };

  const endorseCandidate = (candidateId: string) =>
    editVotingGuideCandidate(candidateId, true);

  const unendorseCandidate = (candidateId: string) =>
    editVotingGuideCandidate(candidateId, false);

  const handleAddNoteClick = (politician: Partial<PoliticianResult>) => {
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
            isOpen={dialogOpen}
            handleClose={() => setDialogOpen(false)}
          />
        )}
        {race.candidates
          .sort(candidateSortFn)
          ?.map((politician: PoliticianResult) => {
            const isEndorsing = votingGuide.candidates
              .filter((c) => c.isEndorsement)
              .map((c) => c.politician.id)
              .includes(politician.id);

            return (
              <div
                className={styles.flexBetween}
                key={politician.id}
                style={{ height: "9rem" }}
              >
                {politician.id == incumbentId && (
                  <span className={styles.sideText}>INCUMBENT</span>
                )}
                {/* <Link href={`/politicians/${politician.slug}`} passHref> */}
                <div className={styles.avatarContainer}>
                  <Menu
                    menuButton={<MenuButton>Star/Note button</MenuButton>}
                    transition
                  >
                    {isEndorsing ? (
                      <MenuItem
                        onClick={() => unendorseCandidate(politician.id)}
                      >
                        Unendorse
                      </MenuItem>
                    ) : (
                      <MenuItem onClick={() => endorseCandidate(politician.id)}>
                        Endorse
                      </MenuItem>
                    )}

                    <MenuItem onClick={() => handleAddNoteClick(politician)}>
                      Add Note
                    </MenuItem>
                  </Menu>

                  {isEndorsing && <strong>LOVE HIM!</strong>}
                  <PartyAvatar
                    size={80}
                    party={politician?.party || ("Unknown" as PoliticalParty)}
                    src={politician?.thumbnailImageUrl as string}
                    alt={politician.fullName}
                  />
                  <h4>{politician.fullName}</h4>
                </div>
                {/* </Link> */}
                {politician.id == incumbentId && race.candidates.length > 1 && (
                  <VerticalDivider />
                )}
              </div>
            );
          })}
      </FieldSet>
    </div>
  );
}
