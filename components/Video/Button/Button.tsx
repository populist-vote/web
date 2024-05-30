import React, { forwardRef } from "react";
import { Spinner } from "../Spinner/Spinner";
// import styles from "./styles.module.css";
import styles from "../../Button/Button.module.scss";

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
          <Spinner size={20}></Spinner>
        </>
      )}
      {children}
    </button>
  );
};

export const Button = forwardRef(ButtonForward);
