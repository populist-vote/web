import { useRouter } from "next/router";
import { AiOutlineSearch } from "react-icons/ai";
import styles from "./SearchInput.module.scss";
import { Dispatch, SetStateAction } from "react";

export function SearchInput({
  placeholder,
  searchValue,
  setSearchValue,
}: {
  placeholder: string;
  searchValue: string;
  setSearchValue: Dispatch<SetStateAction<string>>;
}) {
  const router = useRouter();
  const { query } = router;
  return (
    <div className={styles.inputWithIcon}>
      <input
        placeholder={placeholder}
        onChange={(e) => {
          setSearchValue(e.target.value);
          void router.push(
            {
              query: { ...query, search: e.target.value },
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
