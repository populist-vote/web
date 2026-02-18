import styles from "./FieldSet.module.scss";
import { ReactNode } from "react";
import clsx from "clsx";

interface FieldSetProps {
  heading: string;
  color?: "red" | "blue" | "violet";
  children: ReactNode;
  className?: string;
}

function FieldSet({ heading, color, children, className }: FieldSetProps) {
  const cx = clsx(styles.container, className, {
    [styles[color as string] as string]: color,
  });
  return (
    <fieldset className={cx}>
      <legend>{heading}</legend>
      <div className={styles.flexBetween} style={{ alignItems: "start" }}>
        {children}
      </div>
    </fieldset>
  );
}

export { FieldSet };
