/* eslint-disable jsx-a11y/alt-text */
import React, { useState } from "react";
import Image, { StaticImageData, ImageProps } from "next/image";
import { Img as RemotionImage } from "remotion";

function ImageWithFallback(
  props: ImageProps & {
    [x: string]: unknown;
    fallbackSrc: string | StaticImageData;
    isRemotionImage?: boolean;
  }
) {
  const { src, fallbackSrc, isRemotionImage, ...rest } = props;
  const [imgSrc, setImgSrc] = useState(src);

  if (isRemotionImage) {
    return (
      <RemotionImage
        {...rest}
        src={imgSrc as string}
        onError={() => {
          setImgSrc(fallbackSrc as string);
        }}
      />
    );
  }

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
