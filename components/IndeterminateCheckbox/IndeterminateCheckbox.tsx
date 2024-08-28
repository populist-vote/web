import { HTMLProps, useEffect, useRef } from "react";

export function IndeterminateCheckbox({
  indeterminate,
  className = "",
  ...rest
}: { indeterminate?: boolean } & HTMLProps<HTMLInputElement>) {
  const ref = useRef<HTMLInputElement>(null!);

  useEffect(() => {
    if (typeof indeterminate === "boolean") {
      ref.current.indeterminate = !rest.checked && indeterminate;
    }
  }, [ref, indeterminate, rest.checked]);

  return (
    <>
      <input
        type="checkbox"
        ref={ref}
        className={className}
        style={{ cursor: "pointer" }}
        {...rest}
      />
    </>
  );
}
