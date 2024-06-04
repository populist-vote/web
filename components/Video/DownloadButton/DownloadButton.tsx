import React, { forwardRef } from "react";
import Link from "next/link";
import clsx from "clsx";
import { Spinner } from "../Spinner/Spinner";
import styles from "../../Button/Button.module.scss";
import { State } from "../../../helpers/use-rendering";

type ButtonVariant = "primary" | "secondary" | "text" | "super";
type ButtonSize = "small" | "medium" | "large" | "responsive";
type ButtonTheme =
  | "blue"
  | "yellow"
  | "red"
  | "aqua"
  | "grey"
  | "orange"
  | "violet"
  | "green";

const ButtonForward: React.ForwardRefRenderFunction<
  HTMLButtonElement,
  {
    onClick?: () => void;
    disabled?: boolean;
    children: React.ReactNode;
    loading?: boolean;
    secondary?: boolean;
    href?: string;
    state?: State;
    undo?: () => void;
    variant?: ButtonVariant;
    size?: ButtonSize;
    theme?: ButtonTheme;
  }
> = (
  {
    onClick,
    disabled,
    children,
    loading,
    href,
    state,
    undo,
    variant = "primary",
    size = "large",
    theme = "blue",
  },
  ref
) => {
  const isRendering = state?.status === "rendering";
  const isDone = state?.status === "done";

  const buttonContent = (
    <>
      {loading && <Spinner size={20} />}
      {children}
      {isDone && (
        <span style={{ opacity: 0.6 }}>
          {Intl.NumberFormat("en", {
            notation: "compact",
            style: "unit",
            unit: "byte",
            unitDisplay: "narrow",
          }).format(state.size)}
        </span>
      )}
    </>
  );

  const buttonClassName = clsx(
    styles.common,
    theme && styles[theme],
    variant && styles[variant],
    size && styles[size],
    isRendering && styles.loading
  );

  const buttonProps = {
    ref,
    className: buttonClassName,
    onClick: undo || onClick,
    disabled: disabled || isRendering,
  };

  if (href) {
    return (
      <Link href={href} style={{ textDecoration: "none" }}>
        <button {...buttonProps}>{buttonContent}</button>
      </Link>
    );
  }

  return <button {...buttonProps}>{buttonContent}</button>;
};

export const DownloadButton = forwardRef(ButtonForward);
