import { useEffect, useState } from "react";
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

function Scroller({ children }) {
  return (
    <div className={styles.horizontalScrollContainer}>
      <ScrollMenu>
        {children}
      </ScrollMenu>
    </div>
  )
}

export default Scroller
