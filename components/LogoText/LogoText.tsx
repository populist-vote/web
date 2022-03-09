import Image from "next/image";
import PopulistLogo from "public/images/PopulistLogo.svg";

export function LogoText() {
  return (
    <Image
      src={PopulistLogo}
      alt="Populist"
      layout="responsive"
      objectFit="contain"
      priority
    />
  );
}
