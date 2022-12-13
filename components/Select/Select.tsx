import clsx from "clsx";
import { CSSProperties } from "react";
import { AiFillCaretDown } from "react-icons/ai";
import styles from "./Select.module.scss";

type SelectProps = {
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  value: string;
  options: { value: string; label: string }[];
  color?: "white" | "yellow" | "blue" | "aqua" | "violet" | "salmon";
  backgroundColor?: "transparent" | "blue" | "aqua" | "violet" | "salmon";
  border?: "none" | "solid";
  borderColor?: "transparent" | "blue" | "aqua" | "violet" | "salmon";
  [key: string]: unknown;
};

function Select({
  onChange,
  value,
  options,
  color = "white",
  backgroundColor = "transparent",
  border = "none",
  ...props
}: SelectProps) {
  const styleVars: CSSProperties & {
    "--select-color": string;
    "--select-background-color": string;
  } = {
    [`--select-color`]: `var(--${color})`,
    [`--select-background-color`]: `var(--${backgroundColor}-light)`,
  };

  const cx = clsx(styles.container, {
    [styles.border as string]: border === "solid",
  });

  return (
    <div style={styleVars} className={cx}>
      <select
        className={styles.pillSelect}
        onChange={onChange}
        value={value}
        {...props}
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      <AiFillCaretDown className={styles.chevron} />
    </div>
  );
}

export { Select };
