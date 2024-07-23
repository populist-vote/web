// Divider.tsx
import React from "react";
import clsx from "clsx";
import styles from "./Divider.module.scss";

interface DividerProps {
  vertical?: boolean;
  color?: string;
  height?: string;
  style?: React.CSSProperties;
}

export function Divider({
  vertical,
  color = "var(--blue-dark)",
  height,
  style,
}: DividerProps) {
  const dividerClass = clsx(styles.divider, {
    [styles.vertical as string]: vertical,
    [styles.height as string]: height,
  });

  const horizontalStyle = {
    border: "none",
    height: "1px",
    backgroundColor: color,
    ...style,
  };

  const verticalStyle = {
    borderTop: "none",
    borderLeft: `1px solid ${color}`,
    flex: "0 0 auto",
    margin: "0 8px",
    minHeight: "1.5rem",
    height: height || "100%",
    ...style,
  };

  return (
    <hr
      className={dividerClass}
      style={vertical ? verticalStyle : horizontalStyle}
    />
  );
}

export default Divider;
