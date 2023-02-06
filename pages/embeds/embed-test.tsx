import Script from "next/script";

function EmbedTest() {
  return (
    <div>
      <h1> Test</h1>
      <Script
        src="https://staging.populist.us/widget-client.js"
        data-embed-id="a5d864b8-6780-4c4d-a731-398c1553a326"
        data-bill-id="4a7e7075-a093-4b9b-adff-62111ce52ce2"
      />
    </div>
  );
}

export default EmbedTest;
