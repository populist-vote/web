import { Button } from "components/Button/Button";
import styles from "./PageIndex.module.scss";
import { FaChevronRight, FaChevronLeft, FaCircle } from "react-icons/fa";
import { RiMoreLine } from "react-icons/ri";

interface PaginationProps {
  /** The full array of data to be paginated */
  data: unknown[];

  /** Number of items to show per page */
  pageSize?: number;

  /** Current active page index (0-based) */
  currentPage: number;

  /** Callback function called when page changes */
  onPageChange: (newPage: number) => void;

  /** Maximum number of pagination dots to display */
  maxDots?: number;

  /** Theme configuration for dot colors */
  theme?: "blue" | "grey";
}

const themes = {
  blue: {
    index: {
      selected: "var(--aqua)",
      unselected: "var(--blue-dark)",
    },
    buttons: {
      enabled: "var(--blue)",
      disabled: "var(--blue-light)",
    },
  },
  grey: {
    index: {
      selected: "var(--grey-light)",
      unselected: "var(--grey-dark)",
    },
    buttons: {
      enabled: "var(--grey-darkest)",
      disabled: "var(--grey-light)",
    },
  },
};

export function PageIndex({
  data,
  pageSize = 1,
  currentPage = 0,
  onPageChange,
  maxDots = 25,
  theme = "blue",
}: PaginationProps & { theme?: "blue" | "grey" }) {
  const resolvedTheme = typeof theme === "string" ? themes[theme] : theme;

  // Calculate total pages
  const pageCount = Math.ceil(data.length / pageSize);

  // Calculate the range of dots to show
  const halfMaxDots = Math.floor(maxDots / 2);
  const startPage = Math.max(
    0,
    Math.min(currentPage - halfMaxDots, pageCount - maxDots)
  );
  const endPage = Math.min(pageCount - 1, startPage + maxDots - 1);

  // Navigation handlers
  const handlePreviousPage = () => {
    if (currentPage > 0) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < pageCount - 1) {
      onPageChange(currentPage + 1);
    }
  };

  const handlePageClick = (pageIndex: number) => {
    onPageChange(pageIndex);
  };

  return (
    <div
      className={styles.pageIndex}
      style={
        {
          "--selected-color": resolvedTheme.index.selected,
          "--unselected-color": resolvedTheme.index.unselected,
          "--button-color": resolvedTheme.buttons.enabled,
          "--button-color-disabled": resolvedTheme.buttons.disabled,
        } as React.CSSProperties
      }
    >
      <Button
        theme="blue"
        size="small"
        variant="text"
        label="Previous"
        icon={<FaChevronLeft />}
        onClick={handlePreviousPage}
        disabled={currentPage === 0}
      />

      <span className={styles.pageDots}>
        {startPage > 0 && pageCount > maxDots && (
          <RiMoreLine color="var(--unselected-color)" />
        )}

        {[...Array(endPage - startPage + 1)].map((_, i) => {
          const pageIndex = startPage + i;
          return (
            <FaCircle
              size="0.5em"
              key={pageIndex}
              color={
                pageIndex === currentPage
                  ? "var(--selected-color)"
                  : "var(--unselected-color)"
              }
              onClick={() => handlePageClick(pageIndex)}
            />
          );
        })}

        {endPage < pageCount - 1 && pageCount > maxDots && (
          <RiMoreLine color="var(--unselected-color)" />
        )}
      </span>

      <Button
        size="small"
        variant="text"
        label="Next"
        icon={<FaChevronRight />}
        iconPosition="after"
        onClick={handleNextPage}
        disabled={currentPage === pageCount - 1}
      />
    </div>
  );
}
