import Image from "next/image";
import PopulistLogoBetaDesktop from "public/images/logo-beta-desktop.svg";

export function LogoBeta({ ...rest }) {
  return (
    <Image
      src={PopulistLogoBetaDesktop}
      alt="Populist"
      layout="responsive"
      objectFit="contain"
      priority
      {...rest}
    />
  );
}

