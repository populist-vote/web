import statesData from "public/states.json";

export default function Map() {
  return (
    <div style={{ width: "100w", height: "100vh", overflow: "hidden" }}>
      <USMap />
    </div>
  );
}

export function USMap() {
  return (
    <svg width="100%" height="100%" viewBox="0 0 960 600">
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
            key={index}
            stroke="var(--blue-lighter)"
            strokeWidth="1px"
            d={state.shape}
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
