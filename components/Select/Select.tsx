import clsx from "clsx";
import { CSSProperties } from "react";
import { AiFillCaretDown } from "react-icons/ai";
import styles from "./Select.module.scss";
import { FieldValues, Path, UseFormRegister } from "react-hook-form";

type SelectProps<TFormValues extends FieldValues> = {
  onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  value?: string;
  options: { value: string; label: string }[];
  textColor?: string;
  accentColor?: string;
  backgroundColor?: string;
  border?: "none" | "solid";
  uppercase?: boolean;
  placeholder?: string;
  disabled?: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onSelect?: any;
  name?: Path<TFormValues>;
  register?: UseFormRegister<TFormValues>;
  rules?: Record<string, unknown>;
};

function Select<TFormValues extends Record<string, unknown>>({
  onChange,
  value,
  options,
  textColor = "white",
  accentColor,
  backgroundColor = "transparent",
  border = "none",
  uppercase = false,
  placeholder,
  register,
  name,
  rules,

  ...props
}: SelectProps<TFormValues>) {
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
        {...(register && name && register(name, rules))}
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
