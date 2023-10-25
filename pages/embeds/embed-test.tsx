import Script from "next/script";

function EmbedTest() {
  return (
    <div
      style={{
        backgroundColor: "dodgerblue",
        display: "flex",
      }}
    >
      <div className="populist-d3ea6fff-a537-4d72-9891-c3c82dcd684c" />

      <Script
        src="http://localhost:3030/widget-client.js"
        data-embed-id="d3ea6fff-a537-4d72-9891-c3c82dcd684c"
      />

      <Script
        src="http://localhost:3030/widget-client.js?t=1"
        data-embed-id="cdb2daf0-0951-4e59-ab88-c20cfc1d3252"
      />

      <Script
        src="http://localhost:3030/widget-client.js?t=2"
        data-embed-id="67b3c9f2-984a-4967-bde8-3e7bf9de3d5d"
      />
    </div>
  );
}

export default EmbedTest;
