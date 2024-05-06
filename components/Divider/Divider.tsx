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

  const dividerStyle = {
    borderTop: vertical ? "none" : `1px solid ${color}`,
    borderLeft: vertical ? `1px solid ${color}` : "none",
    flex: vertical ? "0 0 auto" : "1 0 0", // Use flex-grow for horizontal divider
    margin: vertical ? "0 8px" : "16px 0",
    minHeight: vertical ? "1.5rem" : "auto",
    [`--divider-color`]: color,
  };

  return <hr className={dividerClass} style={dividerStyle} />;
}

export default Divider;
