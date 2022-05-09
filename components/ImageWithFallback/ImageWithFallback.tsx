/* eslint-disable jsx-a11y/alt-text */
import React, { useState } from "react";
import Image, { StaticImageData } from "next/image";

const ImageWithFallback = (props: {
  [x: string]: unknown;
  src: string | StaticImageData;
  fallbackSrc: string | StaticImageData;
}) => {
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
};

export default ImageWithFallback;
