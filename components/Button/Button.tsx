import styles from "./Button.module.scss";

import type { PropsWithChildren } from "react";

import { default as classNames } from "classnames";

function Button({
  id, label, onClick, primary, secondary, text, disabled, small, medium, large, icon, children, theme = "blue"
}: PropsWithChildren<{
  id?: string;
  disabled?: boolean;
  icon?: boolean;
  label: string,
  large?: boolean;
  medium?: boolean;
  onClick?: () => void | undefined,
  primary?: boolean;
  secondary?: boolean;
  text?: boolean;
  small?: boolean;
  theme: "blue" | "yellow";
}>) {

  const cx = classNames(styles.common, {
    [styles.icon as string]: icon,
    [styles.large as string]: large,
    [styles.medium as string]: medium,
    [styles.primary as string]: primary,
    [styles.secondary as string]: secondary,
    [styles.small as string]: small,
    [styles.text as string]: text,
    [styles[theme] as string]: true
  });
  return (
    <button id={id} disabled={disabled} aria-label={label} onClick={onClick} className={cx}>{children}</button>
  );
}

export { Button };