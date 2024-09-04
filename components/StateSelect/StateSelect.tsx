import { Select } from "components/Select/Select";
import { State } from "generated";
import { useState } from "react";
import states from "utils/states";

export default function StateSelect({
  defaultState,
  handleStateChange,
}: {
  defaultState?: State | "FEDERAL";
  handleStateChange: (state: State) => void;
}) {
  const [state, setState] = useState<State | "FEDERAL">(
    defaultState || "FEDERAL"
  );
  const stateOptions = [
    ...Object.entries(states).map(([key, value]) => ({
      label: value,
      value: key,
    })),
    { label: "Federal", value: "FEDERAL" },
  ];

  const onChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setState(e.target.value as State);
    handleStateChange(e.target.value as State);
  };

  return (
    <Select
      textColor={"white"}
      backgroundColor="blue"
      options={stateOptions}
      value={state?.toUpperCase()}
      onChange={onChange}
    />
  );
}
