import classNames from "classnames";
import styles from "./TextInput.module.scss";
import { UseFormRegister } from "react-hook-form";

type TextInputProps<TFormValues> = {
  id?: string;
  errors?: boolean | string[] | string
  label: string;
  hideLabel?: boolean;
  value?: string;
  onChange?: () => void;
  placeholder?: string;
  register?: UseFormRegister<TFormValues>;
  type?: "text" | "password"
};

function TextInput<TFormValues extends Record<string, unknown>>({
  id,
  errors = false,
  label,
  hideLabel,
  value,
  onChange,
  placeholder,
  type = "text"
}: TextInputProps<TFormValues>) {
  const inputId = id || "input";
  const inputClasses = classNames(styles.inputContainer, {
    [styles.hideLabel as string]: hideLabel,
  });
  const hasErrors = Array.isArray(errors) ? (
    errors.length > 0
  ) : (
    typeof errors === "string" ? errors.length > 0 : !!errors
  );
  const errorMessage = errors?.join?.(" ") || errors || "";
  return (
    <div className={inputClasses}>
      <label htmlFor={inputId}>{label}</label>
      <input
        aria-invalid={hasErrors}
        type={type}
        value={value || ""}
        id={inputId}
        onChange={onChange}
        placeholder={placeholder || ""}
      />
      {hasErrors && <span className={styles.errorMessage}>{errorMessage}</span>}
    </div>
  );
}

export default TextInput;