import Script from "next/script";
// import { InitWidget } from "../../scripts/widget-client";

function EmbedTest() {
  return (
    <>
      <Script
        src={"/widget-client.js"}
        data-bill-id="000d920a-e964-474f-a08b-49b7607f81c2"
        data-api-key
      />
      <div>
        <h1>Test</h1>
        <p>Test</p>
      </div>
    </>
  );
}

export default EmbedTest;
