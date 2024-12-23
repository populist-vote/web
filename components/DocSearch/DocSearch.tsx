import React, { useState, useEffect, useRef } from "react";
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
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [searchIndex, setSearchIndex] = useState<SearchResult[]>([]);

  // Refs for handling scroll into view
  const resultsContainerRef = useRef<HTMLDivElement>(null);
  const selectedResultRef = useRef<HTMLAnchorElement>(null);

  // Load search index
  useEffect(() => {
    fetch("/search-index.json")
      .then((res) => res.json())
      .then(setSearchIndex)
      .catch(console.error);
  }, []);

  // Reset selected index when results change
  useEffect(() => {
    setSelectedIndex(results.length > 0 ? 0 : -1);
  }, [results]);

  // Scroll selected item into view
  useEffect(() => {
    if (selectedResultRef.current && resultsContainerRef.current) {
      selectedResultRef.current.scrollIntoView({
        block: "nearest",
        behavior: "smooth",
      });
    }
  }, [selectedIndex]);

  // Handle keyboard shortcuts
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

  // Handle navigation keys
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!open) return;

      console.log(selectedIndex);

      switch (e.key) {
        case "ArrowDown":
          e.preventDefault();
          setSelectedIndex((prev) =>
            prev < results.length - 1 ? prev + 1 : prev
          );
          break;
        case "ArrowUp":
          e.preventDefault();
          setSelectedIndex((prev) => (prev > 0 ? prev - 1 : prev));
          break;
        case "Enter":
          e.preventDefault();
          if (selectedIndex >= 0 && selectedIndex < results.length) {
            const href = results[selectedIndex]?.href;
            if (href) {
              window.location.href = href;
            }
            setOpen(false);
          }
          break;
        case "Escape":
          setOpen(false);
          break;
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open, results, selectedIndex]);

  // Search logic with content matching (unchanged)
  const search = (searchQuery: string) => {
    if (!searchQuery) {
      setResults([]);
      return;
    }

    const searchTerms = searchQuery.toLowerCase().split(" ");

    const results = searchIndex.map((item) => {
      let score = 0;
      const matches: { text: string; type: "content" | "heading" }[] = [];

      if (
        searchTerms.every((term) => item.label.toLowerCase().includes(term))
      ) {
        score += 10;
      }

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

      if (item.content) {
        const contentLower = item.content.toLowerCase();
        const allTermsInContent = searchTerms.every((term) =>
          contentLower.includes(term)
        );

        if (allTermsInContent) {
          score += 1;
          const snippetLength = 150;
          let bestSnippetScore = 0;
          let bestSnippet = "";

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

  // Track the current result index across all groups
  let currentIndex = -1;

  return (
    <>
      <button onClick={() => setOpen(true)} className={styles.searchButton}>
        <Search size={20} color="var(--blue-text)" />
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

              <div className={styles.resultsList} ref={resultsContainerRef}>
                {results.length === 0 && query && (
                  <div className={styles.noResults}>No results found.</div>
                )}

                {Object.entries(groupedResults).map(([tabId, group]) => (
                  <div key={tabId} className={styles.resultGroup}>
                    <div className={styles.groupHeading}>{group.label}</div>

                    {group.items.map((result) => {
                      currentIndex++;
                      const isSelected = currentIndex === selectedIndex;

                      return (
                        <Link
                          key={result.href}
                          href={result.href}
                          ref={isSelected ? selectedResultRef : null}
                          className={`${styles.resultItem} ${
                            isSelected ? styles.selected : ""
                          }`}
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
                      );
                    })}
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
