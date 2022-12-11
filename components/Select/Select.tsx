import { CSSProperties } from "react";
import { AiFillCaretDown } from "react-icons/ai";
import styles from "./Select.module.scss";

type SelectProps = {
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  value: string;
  options: { value: string; label: string }[];
  color?: "yellow" | "blue" | "aqua" | "violet" | "salmon";
  [key: string]: unknown;
};

function Select({
  onChange,
  value,
  options,
  color = "blue",
  ...props
}: SelectProps) {
  const styleVars: CSSProperties & {
    "--select-color": string;
  } = {
    [`--select-color`]: `var(--${color})`,
  };

  return (
    <div style={styleVars} className={styles.container}>
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
