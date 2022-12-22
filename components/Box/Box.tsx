import { PropsWithChildren } from "react";
import styles from "./Box.module.scss";

type BoxProps = PropsWithChildren;

function Box({ children, ...rest }: BoxProps) {
  return (
    <div className={styles.container} {...rest}>
      {children}
    </div>
  );
}

export { Box };
