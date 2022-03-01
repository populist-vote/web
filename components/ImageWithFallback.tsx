/* eslint-disable jsx-a11y/alt-text */
import React, { useState } from "react";
import Image from "next/image";

const ImageWithFallback = (props: {
  [x: string]: any;
  src: string | StaticImageData;
  fallbackSrc: string | StaticImageData;
}) => {
  const { src, fallbackSrc, ...rest } = props;
  const [imgSrc, setImgSrc] = useState(src);

  console.log(imgSrc);

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
