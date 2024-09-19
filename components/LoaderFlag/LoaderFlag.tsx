import React from "react";
import loaderBlue from "public/images/LoaderBlue.gif";
import loaderGray from "public/images/LoaderGray.gif";
import Image from "next/legacy/image";

function LoaderFlag({
  height,
  theme = "blue",
}: {
  height?: number;
  theme?: "blue" | "gray";
}): JSX.Element {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100%",
      }}
    >
      {theme == "blue" ? (
        <Image
          src={loaderBlue}
          priority
          alt="flag loading"
          height={height}
          unoptimized
        />
      ) : (
        <Image
          src={loaderGray}
          priority
          alt="flag loading"
          height={height}
          unoptimized
        />
      )}
    </div>
  );
}

export { LoaderFlag };
