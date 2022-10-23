import clsx from "clsx";
import styles from "./TextInput.module.scss";
import {
  ChangeHandler,
  FieldValues,
  Path,
  RegisterOptions,
  UseFormRegister,
} from "react-hook-form";
import { ReactNode } from "react";

export type TextInputProps<TFormValues extends FieldValues> = {
  id?: string;
  name: Path<TFormValues>;
  errors?: boolean | string[] | string;
  label?: string;
  hideLabel?: boolean;
  value?: string;
  onChange?: ChangeHandler | (() => void);
  placeholder?: string;
  register?: UseFormRegister<TFormValues>;
  rules?: RegisterOptions;
  type?: "text" | "password";
  icon?: ReactNode;
  [x: string]: unknown;
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
  icon,
  ...rest
}: TextInputProps<TFormValues>) {
  const inputId = id || "input";
  const inputClasses = clsx(styles.inputContainer, {
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
      <div className={styles.inputWithIcon}>
        <input
          id={inputId}
          type={type}
          placeholder={placeholder || ""}
          aria-invalid={hasErrors}
          {...(register && register(name, rules))}
          {...rest}
        />
        {icon}
      </div>

      {hasErrors && errorMessage && (
        <span className={styles.errorMessage}>{errorMessage()}</span>
      )}
    </div>
  );
}

export { TextInput };
