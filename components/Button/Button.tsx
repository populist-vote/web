import styles from "./Button.module.scss";
import type { PropsWithChildren, ReactNode } from "react";
import { default as clsx } from "clsx";

type ButtonVariant = "primary" | "secondary" | "text";

type ButtonTheme = "blue" | "yellow" | "red" | "aqua";

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
  type = "submit",
  fixedWidth,
  ...props
}: PropsWithChildren<{
  /** Sets the disabled state of a button */
  disabled?: boolean;
  /** Set optional fixed width of button */
  fixedWidth?: string;
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
  });
  const inlineStyle = fixedWidth
    ? {
        width: fixedWidth,
      }
    : {};

  const style = (props.style as object) || {};

  return (
    <button
      id={id}
      disabled={disabled}
      onClick={onClick}
      className={cx}
      type={type}
      style={{ ...style, ...inlineStyle }}
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
