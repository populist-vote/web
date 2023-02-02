import Script from "next/script";

function EmbedTest() {
  return (
    <Script
      src="/widget-client.js"
      data-bill-id="d5e625f3-12a0-4e31-9a6f-2d8b82f1f788"
    />
  );
}

export default EmbedTest;
