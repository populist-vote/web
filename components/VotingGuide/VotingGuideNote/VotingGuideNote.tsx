import styles from "./VotingGuideNote.module.scss";
import commonStyles from "styles/page.module.scss";
import Button from "components/Button";
import { createPortal } from "react-dom";
import { PartyAvatar } from "components/Avatar/Avatar";
import {
  PoliticalParty,
  PoliticianResult,
  useDeleteVotingGuideCandidateNoteMutation,
} from "generated";
import usePortal from "hooks/usePortal";
import { useForm } from "react-hook-form";
import { useVotingGuide } from "hooks/useVotingGuide";
import { AtLeast } from "types/global";
import type { EditVotingGuideCandidate } from "components/Ballot/Race";
import { useQueryClient } from "react-query";

export function VotingGuideNote({
  politician,
  isOpen,
  handleClose,
  editVotingGuideCandidate,
}: {
  politician: AtLeast<PoliticianResult, "id">;
  isOpen: boolean;
  handleClose: () => void;
  editVotingGuideCandidate: ({
    candidateId,
    isEndorsement,
    note,
  }: EditVotingGuideCandidate) => void;
}) {
  const { data: votingGuide, queryKey } = useVotingGuide();
  const existingNote = votingGuide?.candidates?.find(
    (c) => c.politician.id === politician.id
  )?.note;

  const queryClient = useQueryClient();
  const invalidateVotingGuideQuery = () =>
    queryClient.invalidateQueries(queryKey);

  const {
    register,
    handleSubmit,
    formState: { isValid },
    setValue,
  } = useForm<{ note: string }>({
    mode: "onChange",
    defaultValues: {
      note: existingNote || "",
    },
  });

  const deleteNoteMutation = useDeleteVotingGuideCandidateNoteMutation();

  const saveNote = ({ note }: { note: string }) => {
    editVotingGuideCandidate({
      candidateId: politician.id,
      note,
    });

    handleClose();
  };

  const deleteNote = () => {
    deleteNoteMutation.mutate(
      {
        votingGuideId: votingGuide.id,
        candidateId: politician.id,
      },
      { onSuccess: () => invalidateVotingGuideQuery() }
    );
    setValue("note", "");
    handleClose();
  };

  const portal = usePortal("modal");
  if (!isOpen || !portal) return null;

  return createPortal(
    <div className={styles.container} id="modal" key={politician.id}>
      <PartyAvatar
        party={politician.party as PoliticalParty}
        src={politician?.thumbnailImageUrl as string}
        alt={politician?.fullName as string}
        size={80}
      />
      <h4>{politician.fullName}</h4>
      <form onSubmit={handleSubmit(saveNote)}>
        <textarea
          {...register("note", {
            required: "Note is required",
          })}
        />
        {existingNote ? (
          <div className={commonStyles.flexBetween}>
            <Button
              variant="primary"
              size="large"
              label="Save note"
              disabled={!isValid}
            >
              Add note
            </Button>
            <Button
              variant="secondary"
              size="large"
              label="Delete note"
              theme="red"
              onClick={deleteNote}
              type="button"
            >
              Delete note
            </Button>
          </div>
        ) : (
          <Button
            variant="primary"
            size="large"
            label="Add note"
            disabled={!isValid}
          >
            Add note
          </Button>
        )}
      </form>
      <Button
        variant="secondary"
        size="large"
        label="Cancel"
        theme="blue"
        onClick={handleClose}
      >
        Close
      </Button>
    </div>,
    portal
  );
}
