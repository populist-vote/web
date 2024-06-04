import React, { useMemo, useEffect, useState } from "react";

export const ProgressBar: React.FC<{
  progress: number;
}> = ({ progress }) => {
  const [visible, setVisible] = useState(true);

  const containerStyle: React.CSSProperties = useMemo(() => {
    return {
      width: "100%",
      height: 10,
      borderRadius: 4,
      backgroundColor: "var(--blue-darker)",
      marginTop: 10,
      marginBottom: 40,
      opacity: visible ? 1 : 0,
      transition: "opacity 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
    };
  }, [visible]);

  const fillStyle: React.CSSProperties = useMemo(() => {
    return {
      backgroundColor: "var(--blue-dark)",
      height: 10,
      borderRadius: 4,
      transition: "width 0.1s ease-in-out",
      width: `${progress * 100}%`,
    };
  }, [progress]);

  useEffect(() => {
    if (progress === 1) {
      setVisible(false);
    } else {
      setVisible(true);
    }
  }, [progress]);

  return (
    <div style={{ height: 35 }}>
      <div style={containerStyle}>
        <div style={fillStyle}></div>
      </div>
    </div>
  );
};
