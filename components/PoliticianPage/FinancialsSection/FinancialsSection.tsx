import { ColumnDef } from "@tanstack/react-table";
import { ColoredSection } from "components/ColoredSection/ColoredSection";
import { Table } from "components/Table/Table";
import { DonationsByIndustry, DonationsSummary, Sector } from "generated";
import Link from "next/link";
import { useMemo } from "react";
import { formatCurrency } from "utils/numbers";
import styles from "./FinancialsSection.module.scss";

function FinancialsSection({
  donationsSummary,
  donationsByIndustry,
}: {
  donationsSummary: DonationsSummary;
  donationsByIndustry: DonationsByIndustry;
}) {
  const columns = useMemo<ColumnDef<Sector>[]>(
    () => [
      {
        accessorKey: "name",
        header: "Industry",
        cell: (info) => info.getValue(),
      },
      {
        accessorKey: "total",
        header: "Total",
        cell: (info) => formatCurrency(info.getValue() as number),
      },
    ],
    []
  );

  if (!donationsSummary && !donationsByIndustry) return null;

  return (
    <ColoredSection color="var(--green)">
      <h2 className={styles.gradientHeader}>Financials</h2>

      {!!donationsSummary && (
        <>
          <p className={styles.flexBetween}>
            <span>Total Raised</span>
            <span className={styles.dots} />
            <span className={styles.white}>
              {formatCurrency(donationsSummary?.totalRaised as number)}
            </span>
          </p>
          <p className={styles.flexBetween}>
            <span>Spent</span>
            <span className={styles.dots} />
            <span className={styles.white}>
              {formatCurrency(donationsSummary?.spent as number)}
            </span>
          </p>
          <p className={styles.flexBetween}>
            <span>Cash on Hand</span>
            <span className={styles.dots} />
            <span className={styles.white}>
              {formatCurrency(donationsSummary?.cashOnHand as number)}
            </span>
          </p>
          <p className={styles.flexBetween}>
            <span>Debt</span>
            <span className={styles.dots} />
            <span className={styles.white}>
              {formatCurrency(donationsSummary?.debt as number)}
            </span>
          </p>
          {!!donationsSummary?.source && (
            <>
              <br />

              <Link href={donationsSummary?.source} passHref>
                <div className={styles.pill}>Source</div>
              </Link>
            </>
          )}
        </>
      )}

      {!!donationsByIndustry && (
        <>
          <h3 style={{ color: "var(--green)", marginTop: "3rem" }}>
            By Industry
          </h3>

          <Table
            data={donationsByIndustry?.sectors || []}
            columns={columns}
            initialState={{
              pagination: {
                pageSize: 7,
              },
              sorting: [
                {
                  id: "total",
                  desc: true,
                },
              ],
            }}
            metaRight={
              !!donationsByIndustry?.source ? (
                <Link
                  href={donationsByIndustry?.source}
                  className={styles.pill}
                >
                  Source
                </Link>
              ) : null
            }
          />
        </>
      )}
    </ColoredSection>
  );
}

export { FinancialsSection };
