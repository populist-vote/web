import styles from "./FieldSet.module.scss";
import { ReactNode } from "react";

interface FieldSetProps {
  heading: string;
  color?: "red" | "blue";
  children: ReactNode;
  [x: string]: unknown;
}

function FieldSet({ heading, color, children, ...rest }: FieldSetProps) {
  return (
    <fieldset
      className={`${color && styles[color]} ${styles.container} `}
      {...rest}
    >
      <legend>{heading}</legend>
      <div className={styles.flexBetween}>{children}</div>
    </fieldset>
  );
}

export { FieldSet };
