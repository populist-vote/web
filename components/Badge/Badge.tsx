import styles from "./Badge.module.scss";
import { CSSProperties, PropsWithChildren, ReactNode } from "react";
import useDocumentBaseStyle from "hooks/useDocumentBaseStyle";
import { addAlphaToHexColor, getContrasting } from "utils/strings";
import clsx from "clsx";

interface BadgeProps {
  color?: string;
  textColor?: string;
  size?: "small" | "medium" | "large";
  iconLeft?: ReactNode;
  label?: string;
  selected?: boolean;
  clickable?: boolean;
  [key: string]: unknown;
}

function Badge({
  color,
  textColor,
  size = "medium",
  iconLeft,
  label,
  selected,
  clickable,
  children,

  ...rest
}: PropsWithChildren<BadgeProps>) {
  const style = useDocumentBaseStyle();
  const colorVar = `--${color}`;
  const textColorVar = `--${textColor}`;
  const styleVars: CSSProperties & {
    "--color": string;
    "--background-color": string;
    "--text-color": string;
  } = {
    [`--color`]: color ? `var(--${color})` : "var(--grey-lighter)",
    [`--background-color`]: colorVar
      ? addAlphaToHexColor(style.getPropertyValue(colorVar), 0.1)
      : "var(--grey-lightest)",
    [`--text-color`]: getContrasting(
      style.getPropertyValue(textColorVar as string)
    ),
  };

  const cx = clsx(styles.container, styles[size as string], {
    [styles.selected as string]: selected,
    [styles.clickable as string]: clickable,
  });

  return (
    <span style={styleVars} className={cx} {...rest}>
      {iconLeft}
      {label || children}
    </span>
  );
}

export { Badge };
