import Script from "next/script";

function EmbedTest() {
  return (
    <div>
      <h1> Test</h1>
      <Script
        src="http://localhost:3030/widget-client.js"
        data-embed-id="e7073a30-e8d8-44df-9528-9089c279ffe7"
        data-bill-id="489caafa-402e-4df3-8a44-f623b256055c"
      />
    </div>
  );
}

export default EmbedTest;
