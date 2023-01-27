import { Button } from "components/Button/Button";
import styles from "./CodeBlock.module.scss";
import { toast } from "react-toastify";
import hljs from "highlight.js";
import { useEffect } from "react";

function CodeBlock({ text }: { text: string }) {
  const handleCopy = () => {
    void navigator.clipboard.writeText(text);
    toast("Copied to clipboard", {
      position: "bottom-right",
      type: "success",
      autoClose: 2000,
    });
  };

  useEffect(() => {
    hljs.initHighlighting();
  }, []);

  return (
    <>
      <div className={styles.container}>
        <div className={styles.actions}>
          <small>HTML</small>
          <Button
            variant="primary"
            size="small"
            onClick={handleCopy}
            label="Copy"
          />
        </div>
        <pre>
          <code className="language-html">{text}</code>
        </pre>
      </div>
    </>
  );
}

export { CodeBlock };
