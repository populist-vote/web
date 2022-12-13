import styles from "./Badge.module.scss";
import { CSSProperties, PropsWithChildren, ReactNode } from "react";
import useDocumentBaseStyle from "hooks/useDocumentBaseStyle";
import { addAlphaToHexColor, getContrasting } from "utils/strings";
import clsx from "clsx";

interface BadgeProps {
  color?: string;
  iconLeft?: ReactNode;
  label?: string;
  selected?: boolean;
  [key: string]: unknown;
}

function Badge({
  color,
  iconLeft,
  label,
  selected,
  children,
  ...rest
}: PropsWithChildren<BadgeProps>) {
  const style = useDocumentBaseStyle();
  const colorVar = `--${color}`;
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
      style.getPropertyValue(colorVar as string)
    ),
  };

  const cx = clsx(styles.container, {
    [styles.selected as string]: selected,
  });

  return (
    <span style={styleVars} className={cx} {...rest}>
      {iconLeft}
      {label || children}
    </span>
  );
}

export { Badge };
