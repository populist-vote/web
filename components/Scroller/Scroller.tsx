import dynamic from "next/dynamic";
import { ReactElement, useContext } from "react";
import { ScrollMenu, VisibilityContext } from "react-horizontal-scrolling-menu";

import styles from "./Scroller.module.scss";

function LeftArrow() {
  const { isFirstItemVisible, scrollPrev } = useContext(VisibilityContext);

  return (
    <button disabled={isFirstItemVisible} onClick={() => scrollPrev()}>
      Left
    </button>
  );
}

function RightArrow() {
  const { isLastItemVisible, scrollNext } = useContext(VisibilityContext);

  return (
    <button disabled={isLastItemVisible} onClick={() => scrollNext()}>
      Right
    </button>
  );
}

type ScrollerItem = ReactElement<{
  itemId: string; // Required. id for every item, should be unique
}>;

function Scroller(props: {
  children: ScrollerItem | ScrollerItem[];
  onePageAtATime?: boolean;
}) {
  return (
    <div className={styles.horizontalScrollContainer}>
      <ScrollMenu itemClassName={props.onePageAtATime ? styles.scrollPage : ""}>
        {props.children}
      </ScrollMenu>
    </div>
  );
}

export default Scroller;
