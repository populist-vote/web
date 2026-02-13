import { Select } from "components/Select/Select";
import { State } from "generated";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import states from "utils/states";

export default function StateSelect({
  defaultState,
  handleStateChange,
}: {
  defaultState?: State | "FEDERAL";
  handleStateChange: (state: State) => void;
}) {
  const router = useRouter();
  const [state, setState] = useState<State | "FEDERAL">(
    (router.query.state as State) || defaultState || "FEDERAL"
  );

  // Sync state → URL when user changes the selection
  useEffect(() => {
    if (router.query.state !== state) {
      void router.push(
        {
          pathname: router.pathname,
          query: { ...router.query, state },
        },
        undefined,
        { shallow: true }
      );
    }
  }, [state, router]);

  // Sync URL → state only when the URL actually changes (e.g. back/forward).
  // Don't depend on `state` here: when the user picks a new state we update
  // local state first; the URL hasn't changed yet. If we also depended on
  // `state`, this effect would run and overwrite with stale router.query.state.
  useEffect(() => {
    if (router.query.state) {
      setState(router.query.state as State);
    }
  }, [router.query.state]);

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
