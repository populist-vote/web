import Image from "next/image";
import PopulistLogo from "public/images/LogoWithText.svg";

function LogoText({ ...rest }) {
  return (
    <Image
      src={PopulistLogo}
      alt="Populist"
      layout="responsive"
      objectFit="contain"
      priority
      {...rest}
    />
  );
}

export { LogoText };
