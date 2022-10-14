import classNames from "classnames";
import { BillCard } from "components/BillCard/BillCard";
import { BillResult, BillResultConnection } from "generated";
import dynamic from "next/dynamic";
import styles from "./SponsoredBillsSection.module.scss";

const Scroller = dynamic(() => import("components/Scroller/Scroller"), {
  ssr: false,
});

function SponsoredBillsSection({
  sponsoredBills,
}: {
  sponsoredBills: BillResultConnection;
}) {
  if (
    sponsoredBills &&
    sponsoredBills.edges &&
    sponsoredBills.edges.length > 0
  ) {
    const edges =
      (sponsoredBills.edges as Array<{ node: Partial<BillResult> }>) || [];
    return (
      <section className={classNames(styles.center, styles.borderTop)}>
        <h4 className={styles.subHeader}>Sponsored Bills</h4>
        <div className={styles.sectionContent}>
          <Scroller>
            {edges
              .map((edge) => {
                return (
                  <BillCard
                    bill={edge.node}
                    key={edge.node.slug}
                    itemId={edge.node.slug as string}
                  />
                );
              })
              .filter((x) => x)}
          </Scroller>
        </div>
      </section>
    );
  } else {
    return null;
  }
}

export { SponsoredBillsSection };
