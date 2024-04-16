import React, { forwardRef } from "react";
import { Spacing } from "../Spacing";
import styles from "./styles.module.css";

const ButtonForward: React.ForwardRefRenderFunction<
  HTMLButtonElement,
  {
    onClick?: () => void;
    disabled?: boolean;
    children: React.ReactNode;
    loading?: boolean;
    secondary?: boolean;
  }
> = ({ onClick, disabled, children, loading, secondary }, ref) => {
  return (
    <button
      ref={ref}
      className={[
        styles.button,
        secondary ? styles.secondarybutton : undefined,
      ].join(" ")}
      onClick={onClick}
      disabled={disabled}
    >
      {loading && (
        <>
          <Spacing></Spacing>
        </>
      )}
      {children}
    </button>
  );
};

export const Button = forwardRef(ButtonForward);
