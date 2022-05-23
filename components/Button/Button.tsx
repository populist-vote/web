import styles from "./Button.module.scss";

import type { PropsWithChildren } from "react";

import { default as classNames } from "classnames"

function Button({
  label, onClick, primary, secondary, textOnly, disabled, small, medium, large, icon, children, theme
}: PropsWithChildren<{
  label: string,
  onClick: () => void,
  primary: boolean;
  secondary: boolean;
  textOnly: boolean;
  disabled: boolean;
  small: boolean;
  icon: string;
  medium: boolean;
  large: boolean;
  theme: string;
}>) {

  const cx = classNames(styles.common, {
    [styles.primary]: primary,
    [styles.secondary]: secondary,
    [styles.textOnly]: textOnly,
    [styles.disabled]: disabled,
    [styles.large]: large,
    [styles.medium]: medium,
    [styles.small]: small,
    [styles.icon]: !!icon,
    [styles[theme] || styles.blue]: true
  })
  return (
    <button aria-label={label} onClick={onClick} className={cx}>{children}</button>
  )
}

export { Button }