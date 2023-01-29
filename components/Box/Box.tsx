import { CSSProperties, PropsWithChildren } from "react";
import styles from "./Box.module.scss";

type BoxProps = PropsWithChildren<{ width?: string; isLink?: boolean }>;

function Box({ children, width, isLink = false, ...rest }: BoxProps) {
  const styleVars: CSSProperties & {
    "--box-width"?: string;
    "--box-hover-shadow"?: string;
  } = {
    "--box-width": width ?? "100%",
    "--box-hover-shadow": isLink ? "0 0 0 1px var(--blue)" : "none",
  };
  return (
    <div className={styles.container} style={styleVars} {...rest}>
      {children}
    </div>
  );
}

export { Box };
