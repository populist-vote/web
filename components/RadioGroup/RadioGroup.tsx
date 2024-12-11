import { useState, useEffect } from "react";
import styles from "./RadioGroup.module.scss";

type Option<T> = {
  value: T;
  label: string | React.ReactNode; // Allow ReactNode instead of just string
};

type RadioGroupProps<T extends string | number> = {
  options: (Option<T> | T)[];
  selected?: T;
  onChange: (value: T) => void;
  theme?: "blue" | "yellow";
};

export const RadioGroup = <T extends string | number>({
  options,
  selected,
  onChange,
  theme = "blue",
}: RadioGroupProps<T>) => {
  // Normalize options to always have value/label structure
  const normalizedOptions: Option<T>[] = options.map((opt) =>
    typeof opt === "object" ? opt : { value: opt, label: String(opt) }
  );

  // State for controlled component
  const [selectedValue, setSelectedValue] = useState<T | undefined>(
    selected || (normalizedOptions[0]?.value as T)
  );

  // Update internal state when selected prop changes
  useEffect(() => {
    if (selected !== undefined) {
      setSelectedValue(selected);
    }
  }, [selected]);

  // Handle change function updates the selected value
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value as T;
    setSelectedValue(value);
    onChange(value);
  };

  return (
    <div className={styles.container} data-theme={theme}>
      {normalizedOptions.map(({ value, label }) => (
        <label key={String(value)} data-selected={selectedValue === value}>
          <input
            type="radio"
            value={String(value)}
            checked={selectedValue === value}
            onChange={handleChange}
          />
          {label}
        </label>
      ))}
    </div>
  );
};
