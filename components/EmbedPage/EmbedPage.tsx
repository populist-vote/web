import clsx from "clsx";
import { BillWidgetSkeleton } from "components/BillWidget/BillWidgetSkeleton";
import { Box } from "components/Box/Box";
import { CodeBlock } from "components/CodeBlock/CodeBlock";
import { EmbedForm } from "components/EmbedForm/EmbedForm";
import { LoaderFlag } from "components/LoaderFlag/LoaderFlag";
import { EmbedResult, useEmbedByIdQuery } from "generated";
import { toast } from "react-toastify";
import styles from "./EmbedPage.module.scss";

function EmbedPage({ slug, id }: { slug: string; id: string }) {
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

  const text = `
    <script
      src={"populist.us/widget-client.js"}
      data-embed-id=${id}
      data-bill-id="000d920a-e964-474f-a08b-49b7607f81c2"
      data-api-key={process.env.POPULIST_API_KEY}
      />
    `;

  if (isLoading) return <LoaderFlag />;

  return (
    <div className={styles.content}>
      <div className={clsx(styles.options, styles.contextBox)}>
        <h3>Options</h3>
        <Box>
          <EmbedForm slug={slug} embed={data?.embedById as EmbedResult} />
        </Box>
      </div>
      <div className={clsx(styles.contextBox)}>
        <h3>Preview</h3>
        <BillWidgetSkeleton />
      </div>
      <div className={clsx(styles.embedCode, styles.contextBox)}>
        <Box>
          <h4>Embed Code</h4>
          <CodeBlock text={text} />
        </Box>
      </div>
    </div>
  );
}

export { EmbedPage };
