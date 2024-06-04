// Divider.tsx
import React from "react";
import clsx from "clsx";
import styles from "./Divider.module.scss";

interface DividerProps {
  vertical?: boolean;
  color?: string;
}

export function Divider({
  vertical,
  color = "var(--blue-dark)",
}: DividerProps) {
  const dividerClass = clsx(styles.divider, {
    [styles.vertical as string]: vertical,
  });

  const horizontalStyle = {
    border: "none",
    height: "1px",
    backgroundColor: color,
  };

  const verticalStyle = {
    borderTop: "none",
    borderLeft: `1px solid ${color}`,
    flex: "0 0 auto",
    margin: "0 8px",
    minHeight: "1.5rem",
  };

  return (
    <hr
      className={dividerClass}
      style={vertical ? verticalStyle : horizontalStyle}
    />
  );
}

export default Divider;
