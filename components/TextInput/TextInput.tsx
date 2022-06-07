import classNames from "classnames";
import styles from "./TextInput.module.scss";

function TextInput({
  id, label, hideLabel, value, onChange, placeholder
} : {
  id?: string,
  label: string,
  hideLabel?: boolean,
  value: string,
  onChange?: () => void,
  placeholder?: string
}) {
  const inputId = id || "input";
  const inputClasses = classNames(styles.inputContainer, {
    [styles.hideLabel as string]: hideLabel
  });
  return (
    <div className={inputClasses}>
      <label htmlFor={inputId}>
        {label}
      </label>
      <input value={value} id={inputId} onChange={onChange} placeholder={placeholder || ""} />
    </div>
  );
}

export default TextInput;