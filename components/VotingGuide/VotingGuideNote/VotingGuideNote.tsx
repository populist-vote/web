import styles from "./VotingGuideNote.module.scss";
import commonStyles from "styles/page.module.scss";
import Button from "components/Button";
import { createPortal } from "react-dom";
import { PartyAvatar } from "components/Avatar/Avatar";
import {
  PoliticalParty,
  PoliticianResult,
  useUpsertVotingGuideCandidateMutation,
} from "generated";
import usePortal from "hooks/usePortal";
import { useForm } from "react-hook-form";
import { useVotingGuide } from "hooks/useVotingGuide";

export function VotingGuideNote({
  politician,
  isOpen,
  handleClose,
}: {
  politician: Partial<PoliticianResult>;
  isOpen: boolean;
  handleClose: () => void;
}) {
  const { data: votingGuide } = useVotingGuide();
  const existingNote = votingGuide.candidates.find(
    (c) => c.politician.id === politician.id
  )?.note;
  const upsertVotingGuideCandidate = useUpsertVotingGuideCandidateMutation();

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

  const saveNote = ({ note }: { note: string }) => {
    upsertVotingGuideCandidate.mutate({
      votingGuideId: votingGuide.id,
      candidateId: politician.id as string,
      note,
    });

    handleClose();
  };

  const deleteNote = () => {
    upsertVotingGuideCandidate.mutate({
      votingGuideId: votingGuide.id,
      candidateId: politician.id as string,
      note: null,
    });
    setValue("note", "");
    handleClose();
  };

  const portal = usePortal("modal");
  if (!isOpen || !portal) return null;

  return createPortal(
    <div className={styles.container} id="modal" key={politician.id}>
      <PartyAvatar
        party={(politician.party as PoliticalParty) || "UNKNOWN"}
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
            <Button primary large label="Save note" disabled={!isValid}>
              Add note
            </Button>
            <Button
              secondary
              large
              label="Delete note"
              theme="red"
              onClick={deleteNote}
            >
              Delete note
            </Button>
          </div>
        ) : (
          <Button primary large label="Add note" disabled={!isValid}>
            Add note
          </Button>
        )}
      </form>
      <Button secondary large label="Cancel" theme="blue" onClick={handleClose}>
        Close
      </Button>
    </div>,
    portal
  );
}
