/* eslint-disable jsx-a11y/alt-text */
import React, { useState } from "react";
import Image, { StaticImageData, ImageProps } from "next/image";

function ImageWithFallback(
  props: ImageProps & {
    [x: string]: unknown;
    fallbackSrc: string | StaticImageData;
  }
) {
  const { src, fallbackSrc, ...rest } = props;
  const [imgSrc, setImgSrc] = useState(src);

  return (
    <Image
      {...rest}
      src={imgSrc}
      onError={() => {
        setImgSrc(fallbackSrc);
      }}
    />
  );
}

export { ImageWithFallback };
