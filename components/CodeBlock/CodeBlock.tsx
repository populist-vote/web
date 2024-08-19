import { Button } from "components/Button/Button";
import styles from "./CodeBlock.module.scss";
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
          <code>{text}</code>
        </pre>
      </div>
    </>
  );
}

export { CodeBlock };
