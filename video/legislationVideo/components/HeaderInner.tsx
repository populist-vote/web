export const HeaderInner = () => {
  return (
    <header>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        <h3
          id="left"
          style={{
            color: "white",
            fontSize: "2.5rem",
            margin: "2rem 0",
          }}
        >
          MN - HF 4746
        </h3>
        <h3
          id="right"
          style={{
            color: "white",
            fontSize: "2.5rem",
            margin: "2rem 0",
          }}
        >
          2023 - 2024
        </h3>
      </div>
      <hr
        style={{
          border: "1px solid white",
          opacity: "0.1",
          width: "100%",
        }}
      ></hr>
      <h2
        style={{
          // font weight bold
          fontWeight: "600",
          color: "white",
          fontSize: "3rem",
          margin: "2rem 0",
        }}
      >
        Rideshare Regulations
      </h2>
    </header>
  );
};
