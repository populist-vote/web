import styles from "./Badge.module.scss";
import { PropsWithChildren, ReactNode } from "react";
import clsx from "clsx";

interface BadgeProps {
  theme?:
    | "blue"
    | "green-support"
    | "red"
    | "yellow"
    | "grey"
    | "violet"
    | "orange"
    | "aqua";
  variant?: "solid" | "outline";
  size?: "small" | "medium" | "large";
  font?: "primary" | "secondary";
  iconLeft?: ReactNode;
  label?: string;
  selected?: boolean;
  clickable?: boolean;
  lightBackground?: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [x: string]: any;
}

function Badge({
  theme = "grey",
  variant = "outline",
  size = "medium",
  font = "secondary",
  iconLeft,
  label,
  selected,
  clickable,
  lightBackground = false,
  children,

  ...rest
}: PropsWithChildren<BadgeProps>) {
  const cx = clsx(styles.container, styles[size as string], {
    [styles.selected as string]: selected,
    [styles.solid as string]: variant === "solid",
    [styles.lightBackground as string]: lightBackground,
    [styles.clickable as string]: clickable,
    [styles[theme as string] as string]: theme,
    [styles[font as string] as string]: font,
  });

  return (
    // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions
    <div className={cx} {...rest}>
      {iconLeft}
      {label || children}
    </div>
  );
}

export { Badge };
