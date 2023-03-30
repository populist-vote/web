import clsx from "clsx";
import { BillWidget } from "components/BillWidget/BillWidget";
import { BillWidgetSkeleton } from "components/BillWidget/BillWidgetSkeleton";
import { Box } from "components/Box/Box";
import { CodeBlock } from "components/CodeBlock/CodeBlock";
import { EmbedForm } from "components/EmbedForm/EmbedForm";
import { LoaderFlag } from "components/LoaderFlag/LoaderFlag";
import { EmbedResult, useEmbedByIdQuery } from "generated";
import { useState } from "react";
import { toast } from "react-toastify";
import styles from "./EmbedPage.module.scss";

function EmbedPage({ slug, id }: { slug: string; id: string }) {
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

  const htmlText = `
  <!-- Place this div where you want the widget to appear -->
  <div class="populist-${id}" />
  
  <script
    src="${window.location.origin}/widget-client.js"
    data-embed-id="${id}"
    data-bill-id="${billId}"
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
    script.setAttribute(
      "data-bill-id", 
      "${billId}"
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

  if (isLoading) return <LoaderFlag />;

  return (
    <div className={styles.content}>
      <div className={clsx(styles.options)}>
        <h3>Options</h3>
        <Box>
          <EmbedForm slug={slug} embed={data?.embedById as EmbedResult} />
        </Box>
      </div>
      <div className={clsx(styles.preview)}>
        <h3>Preview</h3>
        {billId ? (
          <BillWidget
            billId={billId}
            origin={window.location.origin}
            embedId={id}
          />
        ) : (
          <BillWidgetSkeleton embedId={id} slug={slug} />
        )}
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
    </div>
  );
}

export { EmbedPage };
