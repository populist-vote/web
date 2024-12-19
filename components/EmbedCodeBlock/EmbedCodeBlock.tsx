import { Box } from "components/Box/Box";
import { useState } from "react";
import { Button } from "components/Button/Button";
import styles from "../CodeBlock/CodeBlock.module.scss";
import { toast } from "react-toastify";
import hljs from "highlight.js";
import { useEffect } from "react";

function CodeBlock({
  language,
  setLanguage,
  snippets,
}: {
  language: "html" | "react" | "nextjs";
  setLanguage: (language: "html" | "react" | "nextjs") => void;
  snippets: { html: string; react: string; nextjs: string };
}) {
  const text = snippets[language];

  const handleCopy = () => {
    void navigator.clipboard.writeText(text);
    toast("Copied to clipboard", {
      position: "bottom-right",
      type: "success",
      autoClose: 2000,
    });
  };

  useEffect(() => {
    hljs.highlightAll();
  }, [language]);

  return (
    <>
      <div className={styles.container}>
        <div className={styles.actions}>
          <small>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value as "html" | "react")}
            >
              <option value="html">HTML</option>
              <option value="react">React</option>
              <option value="nextjs">Next.js</option>
            </select>
          </small>
          <Button
            variant="primary"
            size="small"
            onClick={handleCopy}
            label="Copy"
          />
        </div>
        <pre>
          <code className={language === "html" ? "html" : "jsx"}>{text}</code>
        </pre>
      </div>
    </>
  );
}

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
