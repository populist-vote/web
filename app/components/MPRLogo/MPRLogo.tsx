import Image from "next/legacy/image";
import MPRLogoSVG from "public/images/mpr-logo-hor.svg";

function MPRLogo({ ...rest }) {
  return (
    <Image
      src={MPRLogoSVG}
      alt="MPRnews"
      layout="intrinsic"
      objectFit="contain"
      objectPosition="left"
      priority
      {...rest}
    />
  );
}

export { MPRLogo };
