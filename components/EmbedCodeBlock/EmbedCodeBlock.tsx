import { Box } from "components/Box/Box";
import { useState } from "react";
import { Button } from "components/Button/Button";
import styles from "../CodeBlock/CodeBlock.module.scss";
import embedStyles from "./EmbedCodeBlock.module.scss";
import { toast } from "react-toastify";
import hljs from "highlight.js";
import { useEffect } from "react";

import { useRef } from "react";

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
  const codeRef = useRef<HTMLElement | null>(null);

  const handleCopy = () => {
    void navigator.clipboard.writeText(text);
    toast("Copied to clipboard", {
      position: "bottom-right",
      type: "success",
      autoClose: 2000,
    });
  };

  useEffect(() => {
    if (codeRef.current) {
      hljs.highlightElement(codeRef.current);
    }
  }, [language, text]);

  return (
    <>
      <div className={styles.container}>
        <div className={styles.actions}>
          <small>
            <select
              value={language}
              onChange={(e) =>
                setLanguage(e.target.value as "html" | "react" | "nextjs")
              }
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
          <code
            key={language}
            ref={codeRef}
            className={`language-${language === "html" ? "html" : "jsx"}`}
          >
            {text}
          </code>
        </pre>
      </div>
    </>
  );
}

export function EmbedCodeBlock({ id }: { id: string }) {
  const [language, setLanguage] = useState<"html" | "react" | "nextjs">("html");

  const baseSrc = `${window.location.origin}/widget-client-v2.js`;

  const stepOneSnippets = {
    html: `
<!-- Step 1: Load Populist Widget once per page -->
<script async src="${baseSrc}"></script>
    `.trim(),
    react: `
// Step 1: Load the Populist widget script once (e.g. in root app shell)
useEffect(() => {
  const existing = document.querySelector('script[src="${baseSrc}"]');
  if (existing) return;

  const script = document.createElement("script");
  script.src = "${baseSrc}";
  script.async = true;
  document.body.appendChild(script);
}, []);
    `.trim(),
    nextjs: `
import Script from "next/script";

{/* Step 1: Load the script once globally */}
<Script src="${baseSrc}" strategy="afterInteractive" async />
    `.trim(),
  };

  const stepTwoSnippets = {
    html: `
<!-- Step 2: Add embed containers anywhere on the page -->
<div class="populist-embed" data-embed-id="${id}"></div>
    `.trim(),
    react: `
// Step 2: Add embed containers wherever you want widgets rendered
<div className="populist-embed" data-embed-id="${id}" />
    `.trim(),
    nextjs: `
{/* Step 2: Add embed containers wherever you want widgets rendered */}
<div className="populist-embed" data-embed-id="${id}" />
    `.trim(),
  };

  return (
    <Box>
      <p className={embedStyles.stepDescription}>
        <strong className={embedStyles.stepBadge}>1</strong> Copy and paste the
        following code <span className={embedStyles.strong}>once</span> on any
        page that will have Populist embeds.{" "}
        <span className={embedStyles.subtext}>
          If you've already added this script tag to the page, you can skip this
          step.
        </span>
      </p>
      <CodeBlock
        language={language}
        setLanguage={setLanguage}
        snippets={stepOneSnippets}
      />

      <p className={embedStyles.stepDescription}>
        <strong className={embedStyles.stepBadge}>2</strong> Copy and paste the
        following code where you want this specific embed to show up on the
        page.
      </p>
      <CodeBlock
        language={language}
        setLanguage={setLanguage}
        snippets={stepTwoSnippets}
      />
    </Box>
  );
}
