import { Badge } from "components/Badge/Badge";
import { Button } from "components/Button/Button";
import { Select } from "components/Select/Select";
import { BillStatus } from "generated";
import { useRouter } from "next/router";
import { BillIndexProps } from "pages/bills";
import { ChangeEvent, useRef, useState } from "react";
import { AiOutlineSearch } from "react-icons/ai";
import styles from "./BillFilters.module.scss";

// TODO Replace with API values
export type PopularityFilter = "mostPopular" | "mostSupported" | "mostOpposed";

function BillFilters(props: BillIndexProps) {
  const router = useRouter();
  const query = router.query;
  const initialQueryRef = useRef(props.query || query);
  const { search, popularity, year, status } = props.query || query;
  const [searchValue, setSearchValue] = useState<string | null>(search || "");

  const handlePopularityFilter = (value: PopularityFilter) => {
    void router.push({
      query: { ...query, popularity: value },
    });
  };

  const handleYearFilter = (e: ChangeEvent<HTMLSelectElement>) => {
    void router.push({
      query: { ...query, year: e.target.value },
    });
  };

  const handleStatusFilter = (value: BillStatus) => {
    void router.push({
      query: { ...query, status: value },
    });
  };

  const handleCancel = () => {
    void router.push({
      query: { ...initialQueryRef.current, showFilters: "false" },
    });
  };

  const handleApplyFilters = () => {
    void router.push({
      query: { ...query, showFilters: "false" },
    });
  };

  return (
    <div className={styles.container}>
      <section>
        <h4>Year</h4>
        <Select
          backgroundColor="blue"
          onChange={handleYearFilter}
          value={year}
          options={[
            { value: "2022", label: "2022" },
            { value: "2020", label: "2020" },
          ]}
        />
      </section>
      <section>
        <h4>Sort by Popularity</h4>
        <div className={styles.badgeGroup}>
          <Badge
            color="blue"
            label="Most Popular"
            selected={popularity === "mostPopular"}
            onClick={() => handlePopularityFilter("mostPopular")}
          />
          <Badge
            color="green"
            label="Most Supported"
            selected={popularity === "mostSupported"}
            onClick={() => handlePopularityFilter("mostSupported")}
          />
          <Badge
            color="red"
            label="Most Opposed"
            selected={popularity === "mostOpposed"}
            onClick={() => handlePopularityFilter("mostOpposed")}
          />
        </div>
      </section>
      <section>
        <h4>Progress</h4>
        <div className={styles.badgeGroup}>
          <Badge
            color="violet"
            label="Introduced"
            selected={status === BillStatus.Introduced}
            onClick={() => handleStatusFilter(BillStatus.Introduced)}
          />
          <Badge
            color="orange"
            label="In Consideration"
            selected={status === BillStatus.InConsideration}
            onClick={() => handleStatusFilter(BillStatus.InConsideration)}
          />
          <Badge
            color="green"
            label="Became Law"
            selected={status === BillStatus.BecameLaw}
            onClick={() => handleStatusFilter(BillStatus.BecameLaw)}
          />
          <Badge
            color="red"
            label="Failed"
            selected={status === BillStatus.Failed}
            onClick={() => handleStatusFilter(BillStatus.Failed)}
          />
          <Badge
            color="red"
            label="Vetoed"
            selected={status === BillStatus.Vetoed}
            onClick={() => handleStatusFilter(BillStatus.Vetoed)}
          />
        </div>
      </section>
      <section>
        <div className={styles.actions}>
          <Button
            variant="primary"
            size="medium"
            label="Apply"
            onClick={handleApplyFilters}
          />
          <Button
            variant="secondary"
            size="medium"
            label="Cancel"
            onClick={handleCancel}
          />
        </div>
        <div className={styles.inputWithIcon}>
          <input
            placeholder="Search"
            onChange={(e) => {
              setSearchValue(e.target.value);
              void router.push({ query: { ...query, search: e.target.value } });
            }}
            value={searchValue || ""}
          />
          <AiOutlineSearch color="var(--blue)" size={"1.25rem"} />
        </div>
      </section>
    </div>
  );
}

export { BillFilters };
