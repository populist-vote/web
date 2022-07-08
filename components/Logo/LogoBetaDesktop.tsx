import Image from "next/image";
import PopulistLogoBetaDesktop from "public/images/logo-beta-desktop.svg";

function LogoBetaDesktop({ ...rest }) {
  return (
    <Image
      src={PopulistLogoBetaDesktop}
      alt="Populist Beta"
      layout="responsive"
      objectFit="contain"
      priority
      {...rest}
    />
  );
}

export { LogoBetaDesktop };
