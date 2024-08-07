import { CSSProperties, PropsWithChildren } from "react";
import styles from "./Box.module.scss";

type BoxProps = PropsWithChildren<{
  width?: string;
  minWidth?: string;
  maxWidth?: string;
  padding?: string;
  isLink?: boolean;
  flexDirection?: "row" | "column";
}>;

function Box({
  children,
  width = "100%",
  minWidth,
  maxWidth,
  padding = "2rem",
  isLink = false,
  flexDirection = "column",
  ...rest
}: BoxProps) {
  const styleVars: CSSProperties & {
    "--box-width"?: string;
    "--box-min-width"?: string;
    "--box-max-width"?: string;
    "--box-padding"?: string;
    "--box-hover-shadow"?: string;
    "--flex-direction"?: "row" | "column";
  } = {
    "--box-width": width,
    "--box-min-width": minWidth,
    "--box-max-width": maxWidth,
    "--box-padding": padding,
    "--box-hover-shadow": isLink ? "0 0 0 1px var(--blue)" : "none",
    "--flex-direction": flexDirection,
  };
  return (
    <div className={styles.container} style={styleVars} {...rest}>
      {children}
    </div>
  );
}

export { Box };
