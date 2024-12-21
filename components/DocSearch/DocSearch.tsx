import React, { useState, useEffect } from "react";
import { Search } from "lucide-react";
import styles from "./DocSearch.module.scss";
import Link from "next/link";

interface SearchResult {
  label: string;
  href: string;
  content: string;
  tabId: string;
  tabLabel: string;
  tabColor: string;
  section: string;
  score: number;
  headings: { text: string; level: number }[];
  matches: {
    text: string;
    type: "content" | "heading";
  }[];
}

export const DocSearch: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [searchIndex, setSearchIndex] = useState<any[]>([]);

  // Load search index
  useEffect(() => {
    fetch("/search-index.json")
      .then((res) => res.json())
      .then(setSearchIndex)
      .catch(console.error);
  }, []);

  // Handle keyboard shortcut
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen(true);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
      }
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, []);

  // Search logic with content matching
  const search = (searchQuery: string) => {
    if (!searchQuery) {
      setResults([]);
      return;
    }

    const searchTerms = searchQuery.toLowerCase().split(" ");

    const results = searchIndex.map((item) => {
      let score = 0;
      const matches: { text: string; type: "content" | "heading" }[] = [];

      // Search in title
      if (
        searchTerms.every((term) => item.label.toLowerCase().includes(term))
      ) {
        score += 10;
      }

      // Search in headings (if they exist)
      if (item.headings && item.headings.length > 0) {
        item.headings.forEach((heading: { text: string; level: number }) => {
          if (
            searchTerms.every((term) =>
              heading.text.toLowerCase().includes(term)
            )
          ) {
            score += 5;
            matches.push({ text: heading.text, type: "heading" });
          }
        });
      }

      // Search in content (if it exists)
      if (item.content) {
        const contentLower = item.content.toLowerCase();
        const allTermsInContent = searchTerms.every((term) =>
          contentLower.includes(term)
        );

        if (allTermsInContent) {
          score += 1;

          // Find the best matching content snippet
          const snippetLength = 150;
          let bestSnippetScore = 0;
          let bestSnippet = "";

          // If content is shorter than snippet length, use whole content
          if (item.content.length <= snippetLength) {
            bestSnippet = item.content;
          } else {
            for (let i = 0; i < contentLower.length - snippetLength; i += 50) {
              const snippet = item.content.slice(i, i + snippetLength);
              const snippetLower = snippet.toLowerCase();
              let snippetScore = 0;

              searchTerms.forEach((term) => {
                const count = (snippetLower.match(new RegExp(term, "g")) || [])
                  .length;
                snippetScore += count;
              });

              if (snippetScore > bestSnippetScore) {
                bestSnippetScore = snippetScore;
                bestSnippet = snippet;
              }
            }
          }

          if (bestSnippet) {
            matches.push({ text: bestSnippet.trim(), type: "content" });
          }
        }
      }

      return {
        ...item,
        score,
        matches,
      };
    });

    setResults(
      results.filter((item) => item.score > 0).sort((a, b) => b.score - a.score)
    );
  };

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      search(query);
    }, 200);
    return () => clearTimeout(timer);
  }, [query, searchIndex]);

  // Group results by tab
  const groupedResults = results.reduce(
    (acc, item) => {
      if (!acc[item.tabId]) {
        acc[item.tabId] = {
          label: item.tabLabel,
          color: item.tabColor,
          items: [],
        };
      }
      acc[item.tabId]?.items.push(item);
      return acc;
    },
    {} as Record<
      string,
      { label: string; color: string; items: SearchResult[] }
    >
  );

  return (
    <>
      <button onClick={() => setOpen(true)} className={styles.searchButton}>
        <Search size={16} />
        <span>Search documentation...</span>
        <kbd className={styles.shortcut}>⌘K</kbd>
      </button>

      {open && (
        <>
          <div
            className={styles.overlay}
            onClick={() => setOpen(false)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                setOpen(false);
              }
            }}
            role="button"
            tabIndex={0}
          />
          <div className={styles.dialog}>
            <header className={styles.dialogHeader}>
              <h2 className={styles.dialogTitle}>Search Documentation</h2>
            </header>

            <div>
              <input
                type="text"
                className={styles.searchInput}
                placeholder="Search docs..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                autoFocus
              />

              <div className={styles.resultsList}>
                {results.length === 0 && query && (
                  <div className={styles.noResults}>No results found.</div>
                )}

                {Object.entries(groupedResults).map(([tabId, group]) => (
                  <div key={tabId} className={styles.resultGroup}>
                    <div className={styles.groupHeading}>{group.label}</div>

                    {group.items.map((result) => (
                      <Link
                        key={result.href}
                        href={result.href}
                        className={styles.resultItem}
                        onClick={() => setOpen(false)}
                      >
                        <div className={styles.resultHeader}>
                          <span className={styles.resultTitle}>
                            {result.label}
                          </span>
                          <span className={styles.resultSection}>
                            {result.section}
                          </span>
                        </div>

                        {result.matches.map((match, idx) => (
                          <div key={idx} className={styles.resultMatch}>
                            {match.type === "heading" ? (
                              <span className={styles.matchHeading}>
                                {match.text}
                              </span>
                            ) : (
                              <>...{match.text}...</>
                            )}
                          </div>
                        ))}
                      </Link>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default DocSearch;
