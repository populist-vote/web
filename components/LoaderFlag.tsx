import React from 'react';
import loaderBlue from '../public/images/LoaderBlue.gif';
import Image from "next/image"

export function LoaderFlag({ height }: { height?: string }): JSX.Element {
  return <Image src={loaderBlue} alt="flag loading" />;
}
