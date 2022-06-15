import classNames from "classnames";
import styles from "./TextInput.module.scss";
import { UseFormRegister } from "react-hook-form";

type TextInputProps<TFormValues> = {
  id?: string;
  label: string;
  hideLabel?: boolean;
  value?: string;
  onChange?: () => void;
  placeholder?: string;
  register?: UseFormRegister<TFormValues>;
};

function TextInput<TFormValues extends Record<string, unknown>>({
  id,
  label,
  hideLabel,
  value,
  onChange,
  placeholder,
}: TextInputProps<TFormValues>) {
  const inputId = id || "input";
  const inputClasses = classNames(styles.inputContainer, {
    [styles.hideLabel as string]: hideLabel,
  });
  return (
    <div className={inputClasses}>
      <label htmlFor={inputId}>{label}</label>
      <input
        value={value || ""}
        id={inputId}
        onChange={onChange}
        placeholder={placeholder || ""}
      />
    </div>
  );
}

export default TextInput;