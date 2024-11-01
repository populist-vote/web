import { Box } from "components/Box/Box";
import { CodeBlock } from "components/CodeBlock/CodeBlock";
import { useState } from "react";

export function EmbedCodeBlock({ id }: { id: string }) {
  const [language, setLanguage] = useState<"html" | "react" | "nextjs">("html");
  const htmlText = `
  <!-- Place this div where you want the widget to appear -->
  <div class="populist-${id}"></div>
  
  <script
    src="${window.location.origin}/widget-client.js"
    data-embed-id="${id}"
    ></script>
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

  const nextjsText = `
  import Script from "next/script";

  <div className="populist-${id}" />
  
  <Script
    src="${window.location.origin}/widget-client.js"
    data-embed-id="${id}"
    />
    `;

  const snippets = {
    html: htmlText,
    react: reactText,
    nextjs: nextjsText,
  };

  return (
    <Box>
      <CodeBlock
        language={language}
        setLanguage={setLanguage}
        snippets={snippets}
      />
    </Box>
  );
}
