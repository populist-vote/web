import Script from "next/script";

function EmbedTest() {
  return (
    <div style={{ maxWidth: "512px" }}>
      <div className="populist-993562b0-92de-41b5-a81d-60c36db81a5d" />

      <Script
        src="http://localhost:3030/widget-client.js"
        data-embed-id="993562b0-92de-41b5-a81d-60c36db81a5d"
      />
    </div>
  );
}

export default EmbedTest;
