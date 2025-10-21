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

  const baseSrc = `${window.location.origin}/widget-client-v2.js`;

  const htmlText = `
  <!-- Place this container where you want the widget to appear -->
  <div class="populist-embed" data-embed-id="${id}"></div>

  <!-- Load Populist Widget script once per page -->
  <script async src="${baseSrc}"></script>
  `;

  const reactText = `
  // Place this div where you want the widget to appear
  <div className="populist-embed" data-embed-id="${id}" />

  // Load the Populist widget script once (e.g. in _app.tsx or root useEffect)
  useEffect(() => {
    const existing = document.querySelector(
      'script[src="${baseSrc}"]'
    );
    if (existing) return; // already loaded

    const script = document.createElement("script");
    script.src = "${baseSrc}";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      // optional: cleanup if your SPA remounts often
      // document.body.removeChild(script);
    };
  }, []);
  `;

  const nextjsText = `
  import Script from "next/script";

  {/* Place widget containers anywhere in your page */}
  <div className="populist-embed" data-embed-id="${id}" />

  {/* Load the script once globally (for example in _app.tsx or Layout component) */}
  <Script src="${baseSrc}" strategy="afterInteractive" async />
  `;

  const snippets = {
    html: htmlText.trim(),
    react: reactText.trim(),
    nextjs: nextjsText.trim(),
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
