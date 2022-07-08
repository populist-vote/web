import React from "react";
import loaderBlue from "public/images/LoaderBlue.gif";
import Image from "next/image";

function LoaderFlag({ height }: { height?: number }): JSX.Element {
  return <Image src={loaderBlue} priority alt="flag loading" height={height} />;
}

export { LoaderFlag };
