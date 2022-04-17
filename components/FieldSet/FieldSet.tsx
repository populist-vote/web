import styles from "./FieldSet.module.scss";
import layoutStyles from "../../components/Layout/Layout.module.scss";
import { ReactNode } from "react";

interface FieldSetProps {
  heading: string;
  color?: "red" | "blue";
  children: ReactNode;
}

export function FieldSet({ heading, color, children }: FieldSetProps) {
  return (
    <fieldset className={`${color && styles[color]} ${styles.container} `}>
      <legend>{heading}</legend>
      <div className={layoutStyles.flexBetween}>{children}</div>
    </fieldset>
  );
}
