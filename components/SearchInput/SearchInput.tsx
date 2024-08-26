import { useRouter } from "next/router";
import { AiOutlineSearch } from "react-icons/ai";
import styles from "./SearchInput.module.scss";
import { Dispatch, SetStateAction } from "react";

export function SearchInput({
  searchId,
  placeholder,
  searchValue,
  setSearchValue,
}: {
  searchId?: string;
  placeholder: string;
  searchValue: string;
  setSearchValue: Dispatch<SetStateAction<string>>;
}) {
  const router = useRouter();
  const { query } = router;
  return (
    <div className={styles.inputWithIcon}>
      <input
        // Only inline styles work within a modal for whatever reason
        style={{
          border: "none",
          outline: "none",
          width: "100%",
          padding: "0.5rem",
          borderRadius: "25px",
        }}
        placeholder={placeholder}
        onChange={(e) => {
          setSearchValue(e.target.value);
          void router.push(
            {
              query: { ...query, search: e.target.value.trim(), searchId },
            },
            undefined,
            { scroll: false, shallow: true }
          );
        }}
        value={searchValue || ""}
      />
      <AiOutlineSearch color="var(--blue)" size={"1.25rem"} />
    </div>
  );
}
