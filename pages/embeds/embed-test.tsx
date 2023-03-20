import { useEffect } from "react";

function EmbedTest() {
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "http://localhost:3030/widget-client.js";
    script.async = true;
    script.setAttribute(
      "data-embed-id",
      "a5d864b8-6780-4c4d-a731-398c1553a326"
    );
    script.setAttribute("data-bill-id", "4a7e7075-a093-4b9b-adff-62111ce52ce2");
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return <div className="populist" />;
}

export default EmbedTest;
