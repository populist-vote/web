import {
  FieldValues,
  Path,
  RegisterOptions,
  UseFormRegister,
} from "react-hook-form";
import styles from "./Checkbox.module.scss";

interface CheckboxProps<TFormValues extends FieldValues> {
  id: string;
  name: Path<TFormValues>;
  label: string;
  register: UseFormRegister<TFormValues>;
  rules?: RegisterOptions<TFormValues, Path<TFormValues>>;
}

function Checkbox<TFormValues extends Record<string, unknown>>({
  id,
  name,
  register,
  label,
  rules,
}: CheckboxProps<TFormValues>) {
  return (
    <label htmlFor={id} className={styles.container}>
      <input id={id} {...(register && register(name, rules))} type="checkbox" />
      <span>{label}</span>
    </label>
  );
}

export { Checkbox };
