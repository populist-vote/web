import Script from "next/script";

function EmbedTest() {
  return (
    <div style={{ maxWidth: "512px" }}>
      <div className="populist-935b8160-72b3-4209-a19b-5ea12f9c99fc" />

      <Script
        src={`${window.location.origin}/widget-client.js`}
        data-embed-id="935b8160-72b3-4209-a19b-5ea12f9c99fc"
      />
    </div>
  );
}

export default EmbedTest;
