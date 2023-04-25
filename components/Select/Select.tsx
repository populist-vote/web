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
    | "blue-text"
    | "blue"
    | "blue-dark"
    | "aqua"
    | "violet"
    | "salmon"
    | "yellow";
  accentColor?:
    | "white"
    | "yellow"
    | "blue-text"
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
  uppercase?: boolean;
  placeholder?: string;
  disabled?: boolean;
  onSelect?: any;
};

function Select({
  onChange,
  value,
  options,
  textColor = "white",
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
    [`--select-text-color`]: `var(--${textColor})`,
    [`--select-accent-color`]: `var(--${accentColor || textColor})`,
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
