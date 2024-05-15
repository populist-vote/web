import clsx from "clsx";
import { BillWidget } from "components/BillWidget/BillWidget";
import { Box } from "components/Box/Box";
import { EmbedBasicsForm } from "components/EmbedBasicsForm/EmbedBasicsForm";
import { LoaderFlag } from "components/LoaderFlag/LoaderFlag";
import {
  EmbedResult,
  EmbedType,
  useDeleteEmbedMutation,
  useEmbedByIdQuery,
} from "generated";
import { toast } from "react-toastify";
import styles from "./EmbedPage.module.scss";
import { Button } from "components/Button/Button";
import { useRouter } from "next/router";
import { PoliticianWidget } from "components/PoliticianWidget/PoliticianWidget";
import { QuestionEmbedForm } from "pages/dashboard/[slug]/embeds/question/new";
import { EmbedCodeBlock } from "components/EmbedCodeBlock/EmbedCodeBlock";
import { QuestionWidget } from "components/QuestionWidget/QuestionWidget";
import { PollEmbedForm } from "pages/dashboard/[slug]/embeds/poll/new";
import { PollWidget } from "components/PollWidget/PollWidget";
import { FaExternalLinkSquareAlt } from "react-icons/fa";
import { RaceWidget } from "components/RaceWidget/RaceWidget";
import { BillTrackerWidget } from "components/BillTrackerWidget/BillTrackerWidget";

function EmbedPage({ id, embedType }: { id: string; embedType: EmbedType }) {
  const { data, isLoading } = useEmbedByIdQuery({
    id,
  });

  if (isLoading) return <LoaderFlag />;

  const billIds = data?.embedById?.attributes?.billIds as string[];
  const billId = data?.embedById?.attributes?.billId as string;
  const politicianId = data?.embedById?.attributes?.politicianId as string;
  const raceId = data?.embedById?.attributes?.raceId as string;
  const embed = data?.embedById as EmbedResult;
  const renderOptions = embed?.attributes?.renderOptions;

  const renderPreviewByType = () => {
    switch (embedType) {
      case EmbedType.Legislation:
        return (
          <BillWidget
            billId={billId}
            origin={window.location.origin}
            embedId={id}
            renderOptions={renderOptions}
          />
        );
      case EmbedType.LegislationTracker:
        return (
          <BillTrackerWidget
            embedId={id}
            origin={window.location.origin}
            billIds={billIds}
            renderOptions={{ tbd: false }}
          />
        );
      case EmbedType.Politician:
        return (
          <PoliticianWidget
            politicianId={politicianId}
            origin={window.location.origin}
            embedId={id}
            renderOptions={renderOptions}
          />
        );
      case EmbedType.Race:
        return (
          <RaceWidget
            raceId={raceId}
            embedId={id}
            origin={window.location.origin}
            renderOptions={renderOptions}
          />
        );
      case EmbedType.Question:
        return <QuestionWidget embedId={id} origin={window.location.origin} />;
      case EmbedType.Poll:
        return <PollWidget embedId={id} origin={window.location.origin} />;
    }
  };

  return (
    <div className={styles.content}>
      <div className={clsx(styles.preview)}>
        <h3>Preview</h3>
        <Box>{renderPreviewByType()}</Box>
      </div>
      <div className={clsx(styles.options)}>
        <h3>Configuration</h3>
        <Box>
          {embedType == EmbedType.Question ? (
            <QuestionEmbedForm buttonLabel="Save" embed={embed} />
          ) : embedType == EmbedType.Poll ? (
            <PollEmbedForm buttonLabel="Save" embed={embed} />
          ) : (
            <EmbedBasicsForm embed={embed} />
          )}
        </Box>
      </div>
      <div className={clsx(styles.embedCode)}>
        <h3>Embed Code</h3>
        <EmbedCodeBlock id={id} />
      </div>
      <div className={styles.deployments}>
        <h3>Deployments</h3>
        <Box>
          {embed.origins.length == 0 && (
            <small className={styles.noResults}>No deployments</small>
          )}
          {embed.origins.map(({ url }) => (
            <a href={url} key={url} className={styles.flexLeft}>
              {url} <FaExternalLinkSquareAlt />
            </a>
          ))}
        </Box>
      </div>
      <div className={styles.dangerZone}>
        <h3>Danger Zone</h3>
        <DeleteEmbedButton id={id} embedType={embedType} />
      </div>
    </div>
  );
}

export { EmbedPage };

export function DeleteEmbedButton({
  id,
  embedType,
}: {
  id: string;
  embedType: string;
}) {
  const router = useRouter();

  const deleteEmbedMutation = useDeleteEmbedMutation();

  const handleDelete = () => {
    confirm("Are you sure you want to delete this embed?") &&
      deleteEmbedMutation.mutate(
        {
          id,
        },
        {
          onSuccess: () => {
            void router.push({
              pathname: `/dashboard/[slug]/embeds/${embedType.toLowerCase()}`,
              query: { slug: router.query.slug },
            });
            toast("Embed deleted", {
              type: "success",
              position: "bottom-right",
            });
          },
        }
      );
  };

  return (
    <Button
      theme="red"
      variant="secondary"
      label="Delete Embed"
      size="small"
      onClick={handleDelete}
    />
  );
}
