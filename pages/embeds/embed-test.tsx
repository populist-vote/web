import Script from "next/script";
import { useEffect } from "react";

function EmbedTest() {
  useEffect(() => {
    const script = document.createElement("script");
    script.src = `${window.location.origin}/widget-client.js`;
    script.async = true;
    script.setAttribute(
      "data-embed-id",
      "a5d864b8-6780-4c4d-a731-398c1553a326"
    );
    script.setAttribute("data-bill-id", "29761924-7b2b-4d73-b8e8-ee2516f70319");
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <div style={{ maxWidth: "512px" }}>
      <div className="populist-a5d864b8-6780-4c4d-a731-398c1553a326" />
      <hr style={{ margin: "2rem" }} />
      <div className="populist-06481be1-e1a4-4082-92c6-f8c46f28d802" />
      <Script
        src={`${window.location.origin}/widget-client.js`}
        data-embed-id="06481be1-e1a4-4082-92c6-f8c46f28d802"
        data-bill-id="91376f34-6f81-4006-ae34-82a7098236ab"
      />
    </div>
  );
}

export default EmbedTest;
