import dynamic from "next/dynamic";
import { ReactElement, useContext, useRef, useState } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { ScrollMenu, slidingWindow, VisibilityContext } from "react-horizontal-scrolling-menu";

import styles from "./Scroller.module.scss";

type ScrollerItem = ReactElement<{
  itemId: string; // Required. id for every item, should be unique
}>;

function Scroller(props: {
  children: ScrollerItem | ScrollerItem[];
  onePageAtATime?: boolean;
}) {
  const [hasScroll, setHasScroll] = useState(false)

  const apiRef = useRef()

  const handleUpdate = (data) => {
    const { initComplete, isFirstItemVisible, isLastItemVisible, items, visibleItems } = data
    setHasScroll(initComplete && (!isFirstItemVisible || !isLastItemVisible))
  }

  return (
    <div className={styles.horizontalScrollContainer}>
      <ScrollMenu apiRef={apiRef} onUpdate={handleUpdate} LeftArrow={LeftArrow} RightArrow={RightArrow} itemClassName={props.onePageAtATime ? styles.scrollPage : ""}>
        {props.children}
      </ScrollMenu>
      {hasScroll && <div className={styles.swipe}>SWIPE</div>}
    </div>
  );
}

function LeftArrow() {
  const { initComplete, isFirstItemVisible, isLastItemVisible, scrollPrev } =
    useContext(VisibilityContext);
  // NOTE initComplete is a hack for  prevent blinking on init
  // Can get visibility of item only after it's rendered
  if (!initComplete || (isFirstItemVisible && isLastItemVisible)) return null
  return (
    <Arrow
      disabled={!initComplete || (initComplete && isFirstItemVisible)}
      onClick={() => scrollPrev()}
    >
      <FaChevronLeft
        color="var(--blue)"
      />
    </Arrow>
  );
}

function RightArrow() {
  const { initComplete, isFirstItemVisible, isLastItemVisible, scrollNext } =
    useContext(VisibilityContext);
  if (initComplete && isFirstItemVisible && isLastItemVisible) return null
  return (
    <Arrow
      disabled={initComplete && isLastItemVisible}
      onClick={() => scrollNext()}
    >
      <FaChevronRight
        color="var(--blue)"
      />
    </Arrow>
  );
}

function Arrow({
  children,
  disabled,
  onClick,
}: {
  children: ReactNode;
  disabled: boolean;
  onClick: VoidFunction;
}) {
  return (
    <button
      disabled={disabled}
      onClick={onClick}
      style={{
        background: "none",
        border: "0",
        cursor: 'pointer',
        display: 'flex',
        flexDirection: 'column',
        height: "1rem",
        justifyContent: 'center',
        margin: "1rem 1rem 0",
        right: '1%',
        userSelect: 'none',
      }}
    >
      {children}
    </button>
  );
}

export default Scroller;
