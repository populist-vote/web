import clsx from "clsx";
import styles from "./TextInput.module.scss";
import {
  ChangeHandler,
  Control,
  FieldValues,
  Path,
  RegisterOptions,
  UseFormRegister,
  useWatch,
} from "react-hook-form";
import { ReactNode } from "react";

type TextInputSize = "small" | "medium" | "large";

type TextInputType = "text" | "password" | "email" | "tel" | "number";

export type TextInputProps<TFormValues extends FieldValues> = {
  id?: string;
  name: Path<TFormValues>;
  size?: TextInputSize;
  errors?: boolean | string[] | string;
  label?: string;
  hideLabel?: boolean;
  value?: string;
  onChange?: ChangeHandler | (() => void);
  placeholder?: string;
  register: UseFormRegister<TFormValues>;
  control: Control<TFormValues>;
  rules?: RegisterOptions;
  watch?: string;
  type?: TextInputType;
  icon?: ReactNode;
  textarea?: boolean;
  charLimit?: number;
  [x: string]: unknown;
};

function TextInput<TFormValues extends Record<string, unknown>>({
  id,
  name,
  size = "large",
  errors = false,
  label,
  hideLabel,
  placeholder,
  type = "text",
  register,
  control,
  rules,
  icon,
  textarea = false,
  charLimit,
  ...rest
}: TextInputProps<TFormValues>) {
  const inputId = id || `input-${name}`;
  const currentValue = useWatch({ name, control });

  const inputClasses = clsx(styles.inputContainer, styles[size as string], {
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
        {textarea ? (
          <textarea
            id={inputId}
            placeholder={placeholder || ""}
            aria-invalid={hasErrors}
            maxLength={charLimit}
            {...(register && register(name, rules))}
            {...rest}
          />
        ) : (
          <input
            id={inputId}
            type={type}
            placeholder={placeholder || ""}
            aria-invalid={hasErrors}
            maxLength={charLimit}
            {...(register && register(name, rules))}
            {...rest}
          />
        )}
        {icon}
      </div>
      {charLimit && (
        <span className={styles.charLimit}>
          <strong style={{ color: "var(--blue-text)" }}>
            {charLimit - (currentValue ? currentValue?.toString().length : 0)}
          </strong>{" "}
          characters remaining
        </span>
      )}

      {hasErrors && errorMessage && (
        <span className={styles.errorMessage}>{errorMessage()}</span>
      )}
    </div>
  );
}

export { TextInput };
