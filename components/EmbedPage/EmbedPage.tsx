import clsx from "clsx";
import { BillWidget } from "components/BillWidget/BillWidget";
import { Box } from "components/Box/Box";
import { EmbedBasicsForm } from "components/EmbedBasicsForm/EmbedBasicsForm";
import { LoaderFlag } from "components/LoaderFlag/LoaderFlag";
import {
  EmbedResult,
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

function EmbedPage({
  id,
  embedType,
}: {
  id: string;
  embedType: "legislation" | "politician" | "question";
}) {
  const { data, isLoading } = useEmbedByIdQuery(
    {
      id,
    },
    {
      onError: (error) => {
        toast((error as Error).message, { type: "error" });
      },
    }
  );

  const billId = data?.embedById?.attributes?.billId as string;
  const politicianId = data?.embedById?.attributes?.politicianId as string;

  const embed = data?.embedById as EmbedResult;

  const renderPreviewByType = () => {
    switch (embedType) {
      case "legislation":
        return (
          <BillWidget
            billId={billId}
            origin={window.location.origin}
            embedId={id}
            renderOptions={embed.attributes.renderOptions}
          />
        );
      case "politician":
        return (
          <PoliticianWidget
            politicianId={politicianId}
            origin={window.location.origin}
            embedId={id}
            renderOptions={embed.attributes.renderOptions}
          />
        );
      case "question":
        return <QuestionWidget embedId={id} origin={window.location.origin} />;
      default:
        return <div>Temp default</div>;
    }
  };

  if (isLoading) return <LoaderFlag />;

  return (
    <div className={styles.content}>
      <div className={clsx(styles.options)}>
        <Box>
          {embedType == "question" ? (
            <QuestionEmbedForm buttonLabel="Save" embed={embed} />
          ) : (
            <EmbedBasicsForm embed={embed} />
          )}
        </Box>
      </div>
      <div className={clsx(styles.preview)}>
        <h3>Preview</h3>
        {renderPreviewByType()}
      </div>
      <div className={clsx(styles.embedCode)}>
        <EmbedCodeBlock id={id} />
      </div>
      <div>
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
              pathname: `/dashboard/[slug]/embeds/${embedType}`,
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
