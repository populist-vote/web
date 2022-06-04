import styles from "./Button.module.scss";
import type { PropsWithChildren, ReactNode } from "react";
import { default as classNames } from "classnames";

type ButtonVariant = "primary" | "secondary" | "text";

type ButtonTheme = "blue" | "yellow";

type ButtonSize = "small" | "medium" | "large";

type IconPosition = "before" | "after";

function Button({
  children,
  disabled,
  hideLabel,
  id,
  icon,
  iconPosition = "before",
  label,
  onClick,
  size = "large",
  theme = "blue",
  variant = "primary",
}: PropsWithChildren<{
  /** Sets the disabled state of a button */
  disabled?: boolean;
  /** Set to true to hide labels for icon only buttons or if label should or if label is different from button text */
  hideLabel?: boolean;
  id?: string;
  /** Accepts an svg element representing an icon */
  icon?: ReactNode;
  /** Renders icon before or after label */
  iconPosition: IconPosition;
  /** Can be used in conjunction with hideLabel to show/hide button text */
  label: string;
  /** Function to handle click events */
  onClick?: () => void | undefined;
  size: ButtonSize;
  theme: ButtonTheme;
  variant: ButtonVariant;
}>) {
  const cx = classNames(
    styles.common,
    styles[variant as string],
    styles[size as string],
    styles[theme as string],
    {
      [styles.iconOnlyButton as string]:
        !children && (!label || hideLabel) && !!icon,
    }
  );
  const labelCx = classNames(styles.buttonLabel, {
    [styles.sr as string]: hideLabel,
  });
  return (
    <button id={id} disabled={disabled} onClick={onClick} className={cx}>
      {iconPosition === "before" && icon}
      <span className={labelCx}>{label}</span>
      {children}
      {iconPosition === "after" && icon}
    </button>
  );
}

export { Button };
