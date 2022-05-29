import {
  PropsWithChildren,
  ReactElement,
  useContext,
  useRef,
  useState,
  ContextType,
} from "react";
import { Button } from "components";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { ScrollMenu, VisibilityContext } from "react-horizontal-scrolling-menu";
import useDeviceInfo from "hooks/useDeviceInfo";

import styles from "./Scroller.module.scss";

import { default as classNames } from "classnames";

type ScrollerItem = ReactElement<{
  itemId: string; // Required. id for every item, should be unique
}>;

function Scroller(props: {
  children: ScrollerItem | ScrollerItem[];
  onePageAtATime?: boolean;
  showTextButtons?: boolean;
}) {
  const [hasScroll, setHasScroll] = useState(false);

  const { isMobile } = useDeviceInfo();

  type scrollVisibilityApiType = ContextType<typeof VisibilityContext>;

  const apiRef = useRef({} as scrollVisibilityApiType);

  const scrollerClasses = classNames(styles.horizontalScrollContainer, {
    [`mobile-scroller`]: isMobile,
    [styles.hideArrowText as string]: !props.showTextButtons,
    [`no-scroll`]: !hasScroll,
  });

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
    <div className={scrollerClasses}>
      <ScrollMenu
        apiRef={apiRef}
        onUpdate={handleUpdate}
        LeftArrow={hasScroll ? LeftArrow : undefined}
        RightArrow={hasScroll ? RightArrow : undefined}
        itemClassName={props.onePageAtATime ? styles.scrollPage : ""}
      >
        {props.children}
      </ScrollMenu>
      {hasScroll && isMobile && <div className={styles.swipe}>SWIPE</div>}
    </div>
  );
}

function LeftArrow() {
  const { isFirstItemVisible, scrollPrev } = useContext(VisibilityContext);
  const { isMobile } = useDeviceInfo();
  const iconColor =
    isMobile || isFirstItemVisible ? "var(--blue)" : "var(--white)";

  return (
    <Arrow
      disabled={isFirstItemVisible}
      onClick={() => scrollPrev()}
      label={"Previous"}
    >
      <FaChevronLeft color={iconColor} />
      {!isMobile && <span>Prev</span>}
    </Arrow>
  );
}

function RightArrow() {
  const { isLastItemVisible, scrollNext } = useContext(VisibilityContext);
  const { isMobile } = useDeviceInfo();
  const iconColor =
    isMobile || isLastItemVisible ? "var(--blue)" : "var(--white)";
  return (
    <Arrow
      disabled={isLastItemVisible}
      onClick={() => scrollNext()}
      label={"Next"}
    >
      {!isMobile && <span>Next</span>}
      <FaChevronRight color={iconColor} />
    </Arrow>
  );
}

function Arrow({
  children,
  disabled,
  onClick,
  label,
}: PropsWithChildren<{
  disabled: boolean;
  onClick: () => void;
  label: string;
}>) {
  const { isMobile } = useDeviceInfo();
  return (
    <Button
      text
      small={isMobile}
      large={!isMobile}
      theme="blue"
      label={label}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </Button>
  );
  return (
    <button
      disabled={disabled}
      onClick={onClick}
      aria-label={label}
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
