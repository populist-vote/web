import { Button } from "components/Button/Button";
import styles from "./CodeBlock.module.scss";
import { toast } from "react-toastify";
import hljs from "highlight.js";
import { useEffect } from "react";
import { Select } from "components/Select/Select";

function CodeBlock({
  language,
  setLanguage,
  snippets,
}: {
  language: "html" | "react";
  setLanguage: (language: "html" | "react") => void;
  snippets: { html: string; react: string };
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
            <Select
              value={language}
              textColor="blue-text"
              options={[
                { label: "HTML", value: "html" },
                { label: "React", value: "react" },
              ]}
              onChange={(e) => setLanguage(e.target.value as "html" | "react")}
            />
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

export { CodeBlock };
