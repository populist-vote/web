import Script from "next/script";
// import { InitWidget } from "../../scripts/widget-client";

function EmbedTest() {
  return (
    <>
      <Script
        src={"/widget-client.js"}
        data-bill-id="000d920a-e964-474f-a08b-49b7607f81c2"
        data-api-key="eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJiMmQ3YjRhOS00M2JjLTQwNzYtOTAxYi05NTkyODFmMDdhODEiLCJ1c2VybmFtZSI6InN1cGVyYWRtaW4iLCJlbWFpbCI6ImluZm9AcG9wdWxpc3QudXMiLCJyb2xlIjoic3VwZXJ1c2VyIiwiZXhwIjoxNjgzMzkzNDcwfQ.M4-1_UMHMn6wooC-SS3wmCF9R6KbJnMjDCkLDplTmrk"
      />
      <div>
        <h1>Test</h1>
        <p>Test</p>
      </div>
    </>
  );
}

export default EmbedTest;
