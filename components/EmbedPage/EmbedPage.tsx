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
import { PollEmbedForm } from "pages/dashboard/[slug]/embeds/poll/new";
import { PollWidget } from "components/PollWidget/PollWidget";

function EmbedPage({
  id,
  embedType,
}: {
  id: string;
  embedType: "legislation" | "politician" | "question" | "poll";
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
      case "poll":
        return <PollWidget embedId={id} origin={window.location.origin} />;
    }
  };

  if (isLoading) return <LoaderFlag />;

  return (
    <div className={styles.content}>
      <div className={clsx(styles.preview)}>
        <h3>Preview</h3>
        <Box>{renderPreviewByType()}</Box>
      </div>
      <div className={clsx(styles.options)}>
        <h3>Configuration</h3>
        <Box>
          {embedType == "question" ? (
            <QuestionEmbedForm buttonLabel="Save" embed={embed} />
          ) : embedType == "poll" ? (
            <PollEmbedForm buttonLabel="Save" embed={embed} />
          ) : (
            <EmbedBasicsForm embed={embed} />
          )}
        </Box>
      </div>
      <div className={clsx(styles.embedCode)}>
        <h3>Embed Code</h3>
        <EmbedCodeBlock id={id} />
        <div style={{ margin: "1rem 0" }}>
          <DeleteEmbedButton id={id} embedType={embedType} />
        </div>
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
