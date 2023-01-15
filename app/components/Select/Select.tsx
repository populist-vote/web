import clsx from "clsx";
import { CSSProperties } from "react";
import { AiFillCaretDown } from "react-icons/ai";
import styles from "./Select.module.scss";

type SelectProps = {
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  value: string;
  options: { value: string; label: string }[];
  textColor?:
    | "white"
    | "yellow"
    | "blue"
    | "blue-dark"
    | "aqua"
    | "violet"
    | "salmon";
  accentColor?:
    | "white"
    | "yellow"
    | "blue"
    | "blue-dark"
    | "aqua"
    | "violet"
    | "salmon";
  backgroundColor?:
    | "transparent"
    | "blue"
    | "aqua"
    | "violet"
    | "salmon"
    | "yellow";
  border?: "none" | "solid";
  borderColor?: "transparent" | "blue" | "aqua" | "violet" | "salmon";
  uppercase?: boolean;
  placeholder?: string;
  [key: string]: unknown;
};

function Select({
  onChange,
  value,
  options,
  color = "white",
  accentColor,
  backgroundColor = "transparent",
  border = "none",
  uppercase = false,
  placeholder,
  ...props
}: SelectProps) {
  const styleVars: CSSProperties & {
    "--select-text-color": string;
    "--select-accent-color": string;
    "--select-background-color": string;
  } = {
    [`--select-text-color`]: `var(--${color})`,
    [`--select-accent-color`]: `var(--${accentColor || color})`,
    [`--select-background-color`]: `var(--${backgroundColor})`,
  };

  const cx = clsx(styles.container, {
    [styles.border as string]: border === "solid",
    [styles.uppercase as string]: uppercase,
  });

  return (
    <div style={styleVars} className={cx}>
      <select
        className={styles.select}
        onChange={onChange}
        value={value}
        {...props}
      >
        {placeholder && (
          <option value="" disabled selected hidden>
            {placeholder}
          </option>
        )}
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
