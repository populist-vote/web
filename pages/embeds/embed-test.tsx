import Script from "next/script";

function EmbedTest() {
  return (
    <Script
      src={"/widget-client.js"}
      data-bill-id="000d920a-e964-474f-a08b-49b7607f81c2"
      data-api-key={process.env.POPULIST_API_KEY}
    />
  );
}

export default EmbedTest;
