import clsx from "clsx";
import { BillWidget } from "components/BillWidget/BillWidget";
import { BillWidgetSkeleton } from "components/BillWidget/BillWidgetSkeleton";
import { Box } from "components/Box/Box";
import { CodeBlock } from "components/CodeBlock/CodeBlock";
import { EmbedForm } from "components/EmbedForm/EmbedForm";
import { LoaderFlag } from "components/LoaderFlag/LoaderFlag";
import {
  BillResult,
  EmbedResult,
  useBillByIdQuery,
  useEmbedByIdQuery,
} from "generated";
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

  const billId = data?.embedById?.attributes?.billId as string;
  const { data: billData } = useBillByIdQuery({
    id: billId,
  });

  const text = `
    <script
      src="populist.us/widget-client.js"
      data-embed-id="${id}"
      data-bill-id="${billId}"
      data-api-key={process.env.POPULIST_API_KEY}
      />
    `;

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
          <BillWidget bill={billData?.billById as BillResult} />
        ) : (
          <BillWidgetSkeleton />
        )}
      </div>
      <div className={clsx(styles.embedCode)}>
        <Box>
          <h4>Embed Code</h4>
          <CodeBlock text={text} />
        </Box>
      </div>
    </div>
  );
}

export { EmbedPage };
