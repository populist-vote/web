import type { PropsWithChildren, ReactNode, CSSProperties } from "react";
import { default as clsx } from "clsx";
import styles from "./Button.module.scss";

type ButtonVariant = "primary" | "secondary" | "text" | "super";

type ButtonTheme =
  | "blue"
  | "yellow"
  | "red"
  | "aqua"
  | "grey"
  | "orange"
  | "violet";

type ButtonSize = "small" | "medium" | "large" | "responsive";

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
  type = "submit",
  width = "inherit",
  wrapText = false,
  ...props
}: PropsWithChildren<{
  /** Sets the disabled state of a button */
  disabled?: boolean;
  /** Set optional fixed width of button */
  width?: string;
  /** Set to true to hide labels for icon only buttons or if label should or if label is different from button text */
  hideLabel?: boolean;
  id?: string;
  /** Accepts an svg element representing an icon */
  icon?: ReactNode;
  /** Renders icon before or after label */
  iconPosition?: IconPosition;
  /** Can be used in conjunction with hideLabel to show/hide button text */
  label: string;
  /** Function to handle click events */
  onClick?: () => unknown | undefined;
  wrapText?: boolean;
  size: ButtonSize;
  theme?: ButtonTheme;
  variant: ButtonVariant;
  type?: "submit" | "button";
  [x: string]: unknown;
}>) {
  const cx = clsx(
    styles.common,
    styles[variant as string],
    styles[size as string],
    styles[theme as string],
    {
      [styles.iconOnlyButton as string]:
        !children && (!label || hideLabel) && !!icon,
    }
  );
  const labelCx = clsx(styles.buttonLabel, {
    [styles.sr as string]: hideLabel,
    [styles.noWrapText as string]: !wrapText,
  });
  const styleVars: CSSProperties & {
    "--button-width": string | undefined;
  } = {
    [`--button-width`]: width,
  };

  const style = (props.style as object) || {};

  return (
    <button
      id={id}
      disabled={disabled}
      onClick={onClick}
      className={cx}
      type={type}
      style={{ ...style, ...styleVars }}
      {...props}
    >
      {iconPosition === "before" && icon}
      <span className={labelCx}>{label}</span>
      {children}
      {iconPosition === "after" && icon}
    </button>
  );
}

export { Button };
