import React, { forwardRef } from "react";
import Link from "next/link";
import { Spinner } from "../Spinner/Spinner";
import styles from "./DownloadButton.module.scss";
import { State } from "../../../helpers/use-rendering";

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
  }
> = (
  { onClick, disabled, children, loading, secondary, href, state, undo },
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

  const buttonClassName = [
    styles.button,
    secondary ? styles.secondarybutton : undefined,
  ]
    .filter(Boolean)
    .join(" ");

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
