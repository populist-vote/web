import { Button } from "components/Button/Button";
import styles from "./CodeBlock.module.scss";
import { toast } from "react-toastify";
import hljs from "highlight.js";
import { useEffect } from "react";

// Get all supported languages from highlight.js
type HljsLanguage = ReturnType<typeof hljs.listLanguages>[number];

interface CodeBlockProps {
  code: string;
  language: HljsLanguage;
}

export function CodeBlock({ code, language }: CodeBlockProps) {
  const handleCopy = () => {
    void navigator.clipboard.writeText(code);
    toast("Copied to clipboard", {
      position: "bottom-right",
      type: "success",
      autoClose: 2000,
    });
  };

  useEffect(() => {
    hljs.highlightAll();
  }, [code, language]);

  return (
    <div className={styles.container}>
      <div className={styles.actions}>
        <small>{language}</small>
        <Button
          variant="primary"
          size="small"
          onClick={handleCopy}
          label="Copy"
        />
      </div>
      <pre>
        <code className={language}>{code}</code>
      </pre>
    </div>
  );
}
