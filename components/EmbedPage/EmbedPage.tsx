import clsx from "clsx";
import { BillWidget } from "components/BillWidget/BillWidget";
import { Box } from "components/Box/Box";
import { EmbedBasicsForm } from "components/EmbedBasicsForm/EmbedBasicsForm";
import { LoaderFlag } from "components/LoaderFlag/LoaderFlag";
import {
  EmbedResult,
  QuestionSubmissionResult,
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
import { Table } from "components/Table/Table";
import { useMemo } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { getRelativeTimeString } from "utils/dates";

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
  const submissions = data?.embedById?.question
    ?.submissions as QuestionSubmissionResult[];

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
        <div style={{ marginTop: "1rem" }}>
          <DeleteEmbedButton id={id} embedType={embedType} />
        </div>
      </div>
      <div className={clsx(styles.embedCode)}>
        <EmbedCodeBlock id={id} />
      </div>
      {embedType == "question" && (
        <QuestionSubmissionsTable submissions={submissions} />
      )}
    </div>
  );
}

export { EmbedPage };

function QuestionSubmissionsTable({
  submissions,
}: {
  submissions: QuestionSubmissionResult[];
}) {
  const columns = useMemo<ColumnDef<QuestionSubmissionResult>[]>(
    () => [
      {
        header: "Response",
        accessorKey: "response",
      },
      {
        header: "Name",
        accessorKey: "respondent.name",
      },
      {
        header: "Email",
        accessorKey: "respondent.email",
      },
      {
        header: "Created At",
        accessorKey: "createdAt",
        cell: (info) =>
          getRelativeTimeString(new Date(info.getValue() as string)),
        size: 100,
      },
    ],
    []
  );

  return <Table columns={columns} initialState={{}} data={submissions} />;
}

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
