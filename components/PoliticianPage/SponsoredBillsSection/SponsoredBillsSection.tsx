import clsx from "clsx";
import { BillCard } from "components/BillCard/BillCard";
import { LoaderFlag } from "components/LoaderFlag/LoaderFlag";
import { BillResult, usePoliticianSponsoredBillsQuery } from "generated";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import styles from "./SponsoredBillsSection.module.scss";

const Scroller = dynamic(() => import("components/Scroller/Scroller"), {
  ssr: false,
});

function SponsoredBillsSection() {
  const { query } = useRouter();
  const { data, isLoading } = usePoliticianSponsoredBillsQuery({
    slug: query.slug as string,
  });

  const sponsoredBills = data?.politicianBySlug.sponsoredBills;
  if (isLoading) return <LoaderFlag />;
  if (
    sponsoredBills &&
    sponsoredBills.edges &&
    sponsoredBills.edges.length > 0
  ) {
    const edges =
      (sponsoredBills.edges as Array<{ node: Partial<BillResult> }>) || [];
    return (
      <section className={clsx(styles.center, styles.borderTop)}>
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
