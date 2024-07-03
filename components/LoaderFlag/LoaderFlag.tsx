import React from "react";
import loaderBlue from "public/images/LoaderBlue.gif";
import Image from "next/legacy/image";

function LoaderFlag({ height }: { height?: number }): JSX.Element {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100%",
      }}
    >
      <Image src={loaderBlue} priority alt="flag loading" height={height} />
    </div>
  );
}

export { LoaderFlag };
