import classNames from "classnames";
import styles from "./TextInput.module.scss";
import {
  ChangeHandler,
  Path,
  RegisterOptions,
  UseFormRegister,
} from "react-hook-form";

type TextInputProps<TFormValues> = {
  id?: string;
  name: Path<TFormValues>;
  errors?: boolean | string[] | string;
  label: string;
  hideLabel?: boolean;
  value?: string;
  onChange?: ChangeHandler | (() => void);
  placeholder?: string;
  register?: UseFormRegister<TFormValues>;
  rules?: RegisterOptions;
  type?: "text" | "password";
};

function TextInput<TFormValues extends Record<string, unknown>>({
  id,
  name,
  errors = false,
  label,
  hideLabel,
  placeholder,
  type = "text",
  register,
  rules,
  ...rest
}: TextInputProps<TFormValues>) {
  const inputId = id || "input";
  const inputClasses = classNames(styles.inputContainer, {
    [styles.hideLabel as string]: hideLabel,
  });
  const hasErrors = Array.isArray(errors)
    ? errors.length > 0
    : typeof errors === "string"
    ? errors.length > 0
    : !!errors;

  const errorMessage = () => {
    if (typeof errors !== "string" && typeof errors !== "boolean") {
      return errors?.join?.(" ");
    } else {
      return errors || "";
    }
  };

  return (
    <div className={inputClasses}>
      <label htmlFor={inputId}>{label}</label>
      <input
        id={inputId}
        type={type}
        placeholder={placeholder || ""}
        aria-invalid={hasErrors}
        {...rest}
        {...(register && register(name, rules))}
      />
      {hasErrors && errorMessage && (
        <span className={styles.errorMessage}>{errorMessage()}</span>
      )}
    </div>
  );
}

export { TextInput };
