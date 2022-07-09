import Image from "next/image";
import PopulistLogo from "public/images/Logo.svg";

function Logo({ ...rest }) {
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

export { Logo };
