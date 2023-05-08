import { Box } from "components/Box/Box";
import { CodeBlock } from "components/CodeBlock/CodeBlock";
import { useState } from "react";

export function EmbedCodeBlock({ id }: { id: string }) {
  const [language, setLanguage] = useState<"html" | "react">("html");
  const htmlText = `
  <!-- Place this div where you want the widget to appear -->
  <div class="populist-${id}" />
  
  <script
    src="${window.location.origin}/widget-client.js"
    data-embed-id="${id}"
    />
    `;

  const reactText = `
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "${window.location.origin}/widget-client.js";
    script.async = true;
    script.setAttribute(
      "data-embed-id", 
      "${id}"
    );
    document.body.appendChild(script);
    return () => document.body.removeChild(script);
  }, [])

  // Place this div where you want the widget to appear
  return <div className="populist-${id}" />
      `;

  const snippets = {
    html: htmlText,
    react: reactText,
  };

  return (
    <Box>
      <h4>Embed Code</h4>
      <CodeBlock
        language={language}
        setLanguage={setLanguage}
        snippets={snippets}
      />
    </Box>
  );
}
