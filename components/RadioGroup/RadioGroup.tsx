import { useState } from "react";
import styles from "./RadioGroup.module.scss";

export function RadioGroup({
  options = [],
  selected,
  onChange,
}: {
  options: string[];
  selected?: string;
  onChange: (value: string) => void;
}) {
  // State to keep track of the current selected page
  const [selectedPage, setSelectedPage] = useState<string>(
    selected || options[0] || "No options"
  );

  // Handle change function updates the selected page
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedPage(event.target.value);
    onChange(event.target.value);
  };

  return (
    <div className={styles.container}>
      {options.map((option) => (
        <label key={option} data-selected={selectedPage === option}>
          <input
            type="radio"
            value={option}
            checked={selectedPage === option}
            onChange={handleChange}
          />
          {option}
        </label>
      ))}
    </div>
  );
}
