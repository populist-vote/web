import { EmbedResult, EmbedType } from "generated";
import { Table } from "components/Table/Table";
import { ColumnDef, Row } from "@tanstack/react-table";
import { useRouter } from "next/router";
import { useTheme } from "hooks/useTheme";
import { Box } from "components/Box/Box";
import { useState } from "react";
import { AiOutlineSearch } from "react-icons/ai";
import styles from "./EmbedIndex.module.scss";
import Link from "next/link";
import { Badge } from "components/Badge/Badge";
import { LAST_SELECTED_EMBED_TYPE } from "utils/constants";
import { LoaderFlag } from "components/LoaderFlag/LoaderFlag";

function EmbedIndex({
  isLoading,
  slug,
  title,
  embedType,
  embeds,
  columns,
}: {
  isLoading: boolean;
  slug: string;
  title: string;
  embedType: EmbedType;
  embeds: EmbedResult[];
  columns: ColumnDef<EmbedResult>[];
}) {
  const router = useRouter();
  const { theme } = useTheme();
  const { search } = router.query;
  const [searchValue, setSearchValue] = useState(search);

  const onRowClick = (row: Row<EmbedResult>) =>
    router.push(
      `/dashboard/${slug}/embeds/${embedType.toLowerCase()}/${
        row.original.id
      }/manage`
    );

  if (isLoading)
    return (
      <div className={styles.centered}>
        <LoaderFlag />
      </div>
    );

  return (
    <div>
      <div style={{ display: "flex", gap: "1rem", marginTop: "1.5rem" }}>
        <Link href={`/dashboard/${slug}/embeds/legislation`}>
          <Badge
            theme="yellow"
            clickable
            label="Legislation"
            selected={router.asPath.includes("/legislation")}
            onClick={() =>
              localStorage.setItem(LAST_SELECTED_EMBED_TYPE, "legislation")
            }
          />
        </Link>
        <Link href={`/dashboard/${slug}/embeds/politician`}>
          <Badge
            theme="aqua"
            clickable
            label="Politician"
            selected={router.asPath.includes("/politician")}
            onClick={() =>
              localStorage.setItem(LAST_SELECTED_EMBED_TYPE, "politician")
            }
          />
        </Link>
        <Link href={`/dashboard/${slug}/embeds/race`}>
          <Badge
            theme="blue"
            clickable
            label="Race"
            selected={router.asPath.includes("/race")}
            onClick={() =>
              localStorage.setItem(LAST_SELECTED_EMBED_TYPE, "race")
            }
          />
        </Link>
        <Link href={`/dashboard/${slug}/embeds/question`}>
          <Badge
            theme="orange"
            clickable
            label="Question"
            selected={router.asPath.includes("/question")}
            onClick={() =>
              localStorage.setItem(LAST_SELECTED_EMBED_TYPE, "question")
            }
          />
        </Link>
        <Link href={`/dashboard/${slug}/embeds/poll`}>
          <Badge
            theme="violet"
            clickable
            label="Poll"
            selected={router.asPath.includes("/poll")}
            onClick={() =>
              localStorage.setItem(LAST_SELECTED_EMBED_TYPE, "poll")
            }
          />
        </Link>
      </div>
      <h2>{title}</h2>
      <Box>
        <div className={styles.inputWithIcon}>
          <input
            placeholder="Search for embeds across all columns"
            onChange={(e) => {
              setSearchValue(e.target.value);
              if (e.target.value === "") {
                const { search: _, ...newQuery } = router.query;
                void router.push({
                  query: newQuery,
                });
              } else
                void router.push({
                  query: { ...router.query, search: e.target.value },
                });
            }}
            value={searchValue || ""}
          ></input>
          <AiOutlineSearch color="var(--blue)" size={"1.25rem"} />
        </div>
      </Box>
      {embeds?.length === 0 ? (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            height: "50vh",
          }}
        >
          <strong>
            You don't have any {embedType.toLowerCase()} embeds yet.
          </strong>
        </div>
      ) : (
        <Table
          data={embeds || []}
          columns={columns}
          initialState={{}}
          onRowClick={onRowClick}
          theme={theme}
          useSearchQueryAsFilter={true}
        />
      )}
    </div>
  );
}

export { EmbedIndex };
