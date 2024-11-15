import styles from "./Badge.module.scss";
import { PropsWithChildren, ReactNode } from "react";
import clsx from "clsx";
import { BsXCircleFill } from "react-icons/bs";

interface BadgeProps {
  theme?:
    | "blue"
    | "green-support"
    | "green"
    | "red"
    | "yellow"
    | "grey"
    | "violet"
    | "orange"
    | "aqua";
  variant?: "solid" | "outline";
  size?: "small" | "medium" | "large" | "extra-large" | "responsive";
  font?: "primary" | "secondary";
  iconLeft?: ReactNode;
  label?: string;
  selected?: boolean;
  clickable?: boolean;
  lightBackground?: boolean;
  dismissible?: boolean;
  onDismiss?: () => void;
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
  dismissible = false,
  onDismiss,

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
      {dismissible && (
        <BsXCircleFill onClick={onDismiss} className={styles.dismissButton} />
      )}
    </div>
  );
}

export { Badge };
