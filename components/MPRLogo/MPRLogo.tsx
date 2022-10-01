import Image from "next/image";
import MPRLogoSVG from "public/images/mpr-logo-hor.svg";

function MPRLogo({ ...rest }) {
  return (
    <Image
      src={MPRLogoSVG}
      alt="MPRnews"
      layout="responsive"
      objectFit="contain"
      priority
      {...rest}
    />
  );
}

export { MPRLogo };
