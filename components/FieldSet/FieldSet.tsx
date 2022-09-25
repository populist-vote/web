import styles from "./FieldSet.module.scss";
import { ReactNode } from "react";

interface FieldSetProps {
  heading: string;
  color?: "red" | "blue";
  children: ReactNode;
}

function FieldSet({ heading, color, children }: FieldSetProps) {
  return (
    <fieldset className={`${color && styles[color]} ${styles.container} `}>
      <legend>{heading}</legend>
      <div className={styles.flexBetween}>{children}</div>
    </fieldset>
  );
}

export { FieldSet };
