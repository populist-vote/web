import clsx from "clsx";
import { BillSearchAndFilters } from "components/BillFilters/BillSearchAndFilters";
import { BillWidgetSkeleton } from "components/BillWidget/BillWidgetSkeleton";
import { Box } from "components/Box/Box";
import { CodeBlock } from "components/CodeBlock/CodeBlock";
import { BillFiltersParams } from "pages/bills";
import styles from "./Dashboard.module.scss";

function DashboardContent(props: { query: BillFiltersParams }) {
  const text = `
    <script
      src={"populist.us/widget-client.js"}
      data-bill-id="000d920a-e964-474f-a08b-49b7607f81c2"
      data-api-key={process.env.POPULIST_API_KEY}
      />
    `;
  return (
    <div className={styles.dashboardContent}>
      <div className={clsx(styles.searchAndFilters)}>
        <BillSearchAndFilters {...props} />
      </div>

      <div className={clsx(styles.contextBox)}>
        <h3>Preview</h3>
        <BillWidgetSkeleton />
      </div>
      <div className={clsx(styles.options, styles.contextBox)}>
        <h3>Options</h3>
        <Box></Box>
      </div>
      <div className={clsx(styles.halfWidth, styles.contextBox)}>
        <Box>
          <h4>Embed Code</h4>
          <CodeBlock text={text} />
        </Box>
      </div>
    </div>
  );
}

export { DashboardContent };
