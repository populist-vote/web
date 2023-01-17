import Image from "next/legacy/image";
import PopulistLogo from "public/images/logo-with-text.svg";

function LogoTextDark({ ...rest }) {
  return (
    <Image
      src={PopulistLogo}
      alt="Populist"
      objectFit="contain"
      priority
      {...rest}
    />
  );
}

export { LogoTextDark };
