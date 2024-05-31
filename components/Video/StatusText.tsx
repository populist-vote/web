import React from "react";

export const StatusText: React.FC<{
  status: "rendering" | "error";
  errorMessage?: string;
}> = ({ status, errorMessage }) => {
  return (
    <div>
      {status === "rendering" && (
        <>
          <span style={{ color: "var(--blue-text-light", fontStyle: "italic" }}>
            Generating Video...
          </span>
        </>
      )}
      {status === "error" && (
        <>
          <strong>Error:</strong> {errorMessage}
        </>
      )}
    </div>
  );
};
