import clsx from "clsx";
import { BillWidget } from "components/BillWidget/BillWidget";
import { Box } from "components/Box/Box";
import { CodeBlock } from "components/CodeBlock/CodeBlock";
import { EmbedForm } from "components/EmbedForm/EmbedForm";
import { LoaderFlag } from "components/LoaderFlag/LoaderFlag";
import {
  EmbedResult,
  useDeleteEmbedMutation,
  useEmbedByIdQuery,
} from "generated";
import { useState } from "react";
import { toast } from "react-toastify";
import styles from "./EmbedPage.module.scss";
import { Button } from "components/Button/Button";
import { useRouter } from "next/router";
import { PoliticianWidget } from "components/PoliticianWidget/PoliticianWidget";

function EmbedPage({
  id,
  embedType,
}: {
  id: string;
  embedType: "legislation" | "politician";
}) {
  const router = useRouter();
  const [language, setLanguage] = useState<"html" | "react">("html");
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
  // const politicianId = data?.embedById?.attributes?.politicianId as string;
  const embed = data?.embedById as EmbedResult;

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
            toast("Embed deleted", { type: "success" });
          },
        }
      );
  };

  const htmlText = `
  <!-- Place this div where you want the widget to appear -->
  <div class="populist-${id}" />
  
  <script
    src="${window.location.origin}/widget-client.js"
    data-embed-id="${id}"
    />
    `;

  const reactText = `
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "${window.location.origin}/widget-client.js";
    script.async = true;
    script.setAttribute(
      "data-embed-id", 
      "${id}"
    );
    document.body.appendChild(script);
    return () => document.body.removeChild(script);
  }, [])

  // Place this div where you want the widget to appear
  return <div className="populist-${id}" />
      `;

  const snippets = {
    html: htmlText,
    react: reactText,
  };

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
      default:
        return <div>Temp default</div>;
    }
  };

  if (isLoading) return <LoaderFlag />;

  return (
    <div className={styles.content}>
      <div className={clsx(styles.options)}>
        <h3>Options</h3>
        <Box>
          <EmbedForm embed={embed} />
        </Box>
      </div>
      <div className={clsx(styles.preview)}>
        <h3>Preview</h3>

        {renderPreviewByType()}
      </div>
      <div className={clsx(styles.embedCode)}>
        <Box>
          <h4>Embed Code</h4>
          <CodeBlock
            language={language}
            setLanguage={setLanguage}
            snippets={snippets}
          />
        </Box>
      </div>
      <div>
        <Button
          theme="red"
          variant="secondary"
          label="Delete Embed"
          size="small"
          onClick={handleDelete}
        />
      </div>
    </div>
  );
}

export { EmbedPage };
