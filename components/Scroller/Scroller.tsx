import {
  ReactElement,
  ReactNode,
  useContext,
  useRef,
  useState,
  ContextType,
} from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { ScrollMenu, VisibilityContext } from "react-horizontal-scrolling-menu";

import styles from "./Scroller.module.scss";

type ScrollerItem = ReactElement<{
  itemId: string; // Required. id for every item, should be unique
}>;

function Scroller(props: {
  children: ScrollerItem | ScrollerItem[];
  onePageAtATime?: boolean;
}) {
  const [hasScroll, setHasScroll] = useState(false);

  type scrollVisibilityApiType = ContextType<typeof VisibilityContext>;

  const apiRef = useRef({} as scrollVisibilityApiType);

  const handleUpdate = (data: {
    initComplete: boolean;
    isFirstItemVisible: boolean;
    isLastItemVisible: boolean;
  }) => {
    const { initComplete, isFirstItemVisible, isLastItemVisible } = data;
    if (!hasScroll)
      setHasScroll(initComplete && (!isFirstItemVisible || !isLastItemVisible));
  };

  return (
    <div className={styles.horizontalScrollContainer}>
      <ScrollMenu
        apiRef={apiRef}
        onUpdate={handleUpdate}
        LeftArrow={hasScroll ? LeftArrow : undefined}
        RightArrow={hasScroll ? RightArrow : undefined}
        itemClassName={props.onePageAtATime ? styles.scrollPage : ""}
      >
        {props.children}
      </ScrollMenu>
      {hasScroll && <div className={styles.swipe}>SWIPE</div>}
    </div>
  );
}

function LeftArrow() {
  const { isFirstItemVisible, scrollPrev } = useContext(VisibilityContext);

  return (
    <Arrow disabled={isFirstItemVisible} onClick={() => scrollPrev()}>
      <FaChevronLeft color="var(--blue)" />
    </Arrow>
  );
}

function RightArrow() {
  const { isLastItemVisible, scrollNext } = useContext(VisibilityContext);
  return (
    <Arrow disabled={isLastItemVisible} onClick={() => scrollNext()}>
      <FaChevronRight color="var(--blue)" />
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
  onClick: () => void;
}) {
  return (
    <button
      disabled={disabled}
      onClick={onClick}
      style={{
        background: "none",
        border: "0",
        cursor: "pointer",
        display: "flex",
        flexDirection: "column",
        height: "1rem",
        justifyContent: "center",
        margin: "1rem 1rem 0",
        right: "1%",
        userSelect: "none",
      }}
    >
      {children}
    </button>
  );
}

export default Scroller;
