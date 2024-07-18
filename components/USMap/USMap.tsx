import statesData from "public/states.json";

export function USMap({
  handleStateClick,
}: {
  handleStateClick: (state: string) => void;
}) {
  const onStateClick = (event: React.MouseEvent<SVGElement>) => {
    const state = event.currentTarget.getAttribute("data-state");
    if (state) handleStateClick(state);
  };
  return (
    <svg
      width="100%"
      height="100%"
      viewBox="0 0 960 600"
      style={{ filter: "drop-shadow(24px 12px 12px rgba(0, 0, 20, 0.55))" }}
    >
      {statesData.map((state, index) => {
        const color = state.color;
        return (
          <path
            className="someCSSClass"
            style={{
              cursor: "pointer",
              fill: color ?? "var(--blue)",
              transition: "0.3s",
            }}
            data-state={state.id.toLowerCase()}
            key={index}
            stroke="var(--blue-lighter)"
            strokeWidth="1px"
            d={state.shape}
            onClick={onStateClick}
            onMouseOver={(event) => {
              if (event.target instanceof SVGElement)
                event.target.style.fill = "var(--blue-dark)";
            }}
            onMouseOut={(event) => {
              if (event.target instanceof SVGElement)
                event.target.style.fill = color ?? "var(--blue)";
            }}
          ></path>
        );
      })}
    </svg>
  );
}
