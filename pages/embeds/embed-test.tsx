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

  return <div className="populist" style={{ maxWidth: "512px" }} />;
}

export default EmbedTest;
