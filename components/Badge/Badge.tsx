import styles from "./Badge.module.scss";
import { CSSProperties, ReactNode } from "react";
import useDocumentBaseStyle from "hooks/useDocumentBaseStyle";
import { addAlphaToHexColor } from "utils/strings";

interface BadgeProps {
  color?: string;
  iconLeft?: ReactNode;
  children: ReactNode;
}

function Badge({ color, iconLeft, children }: BadgeProps) {
  const style = useDocumentBaseStyle();
  const styleVars: CSSProperties & {
    "--color": string;
    "--background-color": string;
  } = {
    [`--color`]: color ? `var(${color})` : "var(--grey-lighter)",
    [`--background-color`]: color
      ? addAlphaToHexColor(style.getPropertyValue(color), 0.1)
      : "var(--grey-lightest)",
  };

  return (
    <span style={styleVars} className={styles.container}>
      {iconLeft}
      {children}
    </span>
  );
}

export { Badge };
