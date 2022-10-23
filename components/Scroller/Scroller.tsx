import { ReactElement, useContext, useRef, useState, ContextType } from "react";
import { Button } from "components";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { ScrollMenu, VisibilityContext } from "react-horizontal-scrolling-menu";
import useDeviceInfo from "hooks/useDeviceInfo";

import styles from "./Scroller.module.scss";

import { default as clsx } from "clsx";

type ScrollerItem = ReactElement<{
  itemId: string; // Required. id for every item, should be unique
}>;

function Scroller(props: {
  children: ScrollerItem | ScrollerItem[];
  onePageAtATime?: boolean;
  showTextButtons?: boolean;
  hideControls?: boolean;
}) {
  const [hasScroll, setHasScroll] = useState(false);

  const { isMobile } = useDeviceInfo();

  type scrollVisibilityApiType = ContextType<typeof VisibilityContext>;

  const apiRef = useRef({} as scrollVisibilityApiType);

  const scrollerClasses = clsx({
    [`mobile-scroller`]: isMobile,
    [styles.hideArrowText as string]: !props.showTextButtons,
    [`no-scroll`]: !hasScroll,
    [styles.scrollButtons as string]: props.showTextButtons,
    [styles.mobileScrollButtons as string]: isMobile,
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
        LeftArrow={hasScroll && !props.hideControls ? LeftArrow : undefined}
        RightArrow={hasScroll && !props.hideControls ? RightArrow : undefined}
        itemClassName={props.onePageAtATime ? styles.scrollPage : ""}
      >
        {props.children}
      </ScrollMenu>
      {/* {hasScroll && isMobile && <div className={styles.swipe}>SWIPE</div>} */}
    </div>
  );
}

function LeftArrow() {
  const { isFirstItemVisible, scrollPrev } = useContext(VisibilityContext);
  const { isMobile } = useDeviceInfo();

  return (
    <Button
      disabled={isFirstItemVisible}
      theme="blue"
      size={isMobile ? "small" : "large"}
      variant="text"
      onClick={() => scrollPrev()}
      label="Previous"
      hideLabel
      icon={<FaChevronLeft />}
      iconPosition="before"
    >
      {!isMobile && <span>Prev</span>}
    </Button>
  );
}

function RightArrow() {
  const { isLastItemVisible, scrollNext } = useContext(VisibilityContext);
  const { isMobile } = useDeviceInfo();
  return (
    <Button
      disabled={isLastItemVisible}
      theme="blue"
      size={isMobile ? "small" : "large"}
      variant="text"
      onClick={() => scrollNext()}
      label="Next"
      hideLabel
      icon={<FaChevronRight />}
      iconPosition="after"
    >
      {!isMobile && <span>Next</span>}
    </Button>
  );
}

// Need default export here for Nextjs dynamic import
export default Scroller;
