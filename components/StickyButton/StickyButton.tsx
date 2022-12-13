import clsx from "clsx";
import { PropsWithChildren } from "react";
import styles from "./StickyButton.module.scss";

interface StickyButtonProps {
  position: "left" | "right";
  [key: string]: any;
}

function StickyButton({
  position,
  children,
  ...rest
}: PropsWithChildren<StickyButtonProps>) {
  const cx = clsx(styles.container, {
    [styles.left as string]: position === "left",
    [styles.right as string]: position === "right",
  });

  return (
    <div className={cx} {...rest}>
      <button>{children}</button>
    </div>
  );
}

export { StickyButton };
