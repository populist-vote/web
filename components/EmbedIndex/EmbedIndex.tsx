import { EmbedResult, EmbedType } from "generated";
import { Table } from "components/Table/Table";
import { ColumnDef, Row } from "@tanstack/react-table";
import { useRouter } from "next/router";
import { useTheme } from "hooks/useTheme";
import { Box } from "components/Box/Box";
import { useState } from "react";
import styles from "./EmbedIndex.module.scss";
import Link from "next/link";
import { Badge } from "components/Badge/Badge";
import { LAST_SELECTED_EMBED_TYPE } from "utils/constants";
import { LoaderFlag } from "components/LoaderFlag/LoaderFlag";
import { SearchInput } from "components/SearchInput/SearchInput";

function EmbedIndex({
  isLoading,
  slug,
  title,
  embedType,
  embeds,
  columns,
  onRowClick,
}: {
  isLoading: boolean;
  slug: string;
  title: string;
  embedType: EmbedType;
  embeds: EmbedResult[];
  columns: ColumnDef<EmbedResult>[];
  onRowClick?: (row: Row<EmbedResult>) => void;
}) {
  const router = useRouter();
  const { theme } = useTheme();
  const { search } = router.query;

  const [searchValue, setSearchValue] = useState((search as string) || "");

  const handleRowClick = (row: Row<EmbedResult>) =>
    router.push(
      `/dashboard/${slug}/embeds/${embedType.toLowerCase().replace("_", "-")}/${
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
            selected={embedType === EmbedType.Legislation}
            onClick={() =>
              localStorage.setItem(LAST_SELECTED_EMBED_TYPE, "legislation")
            }
          />
        </Link>
        <Link href={`/dashboard/${slug}/embeds/legislation-tracker`}>
          <Badge
            theme="green"
            clickable
            label="Legislation Tracker"
            selected={embedType === EmbedType.LegislationTracker}
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
            selected={embedType === EmbedType.Politician}
            onClick={() =>
              localStorage.setItem(LAST_SELECTED_EMBED_TYPE, "politician")
            }
          />
        </Link>
        <Link href={`/dashboard/${slug}/embeds/candidate-guide`}>
          <Badge
            theme="aqua"
            clickable
            label="Candidate Guide"
            selected={embedType === EmbedType.CandidateGuide}
            onClick={() =>
              localStorage.setItem(LAST_SELECTED_EMBED_TYPE, "candidate-guide")
            }
          />
        </Link>
        <Link href={`/dashboard/${slug}/embeds/race`}>
          <Badge
            theme="blue"
            clickable
            label="Race"
            selected={embedType === EmbedType.Race}
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
            selected={embedType === EmbedType.Question}
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
            selected={embedType === EmbedType.Poll}
            onClick={() =>
              localStorage.setItem(LAST_SELECTED_EMBED_TYPE, "poll")
            }
          />
        </Link>
        <Link href={`/dashboard/${slug}/embeds/my-ballot`}>
          <Badge
            theme="yellow"
            clickable
            label="My Ballot"
            selected={embedType === EmbedType.MyBallot}
            onClick={() =>
              localStorage.setItem(LAST_SELECTED_EMBED_TYPE, "my-ballot")
            }
          />
        </Link>
      </div>
      <h2>{title}</h2>
      <Box>
        <SearchInput
          placeholder="Search for embeds across all columns"
          searchValue={searchValue}
          setSearchValue={setSearchValue}
          searchId="candidateGuides"
        />
      </Box>
      {embeds?.length === 0 && !isLoading ? (
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
            You don't have any {embedType.toLowerCase().replace("_", " ")}{" "}
            embeds yet.
          </strong>
        </div>
      ) : (
        <div style={{ marginTop: "1rem" }}>
          <Table
            data={embeds || []}
            columns={columns}
            initialState={{}}
            onRowClick={onRowClick ? onRowClick : handleRowClick}
            theme={theme}
            useSearchQueryAsFilter={true}
            targetSearchId="candidateGuides"
          />
        </div>
      )}
    </div>
  );
}

export { EmbedIndex };
