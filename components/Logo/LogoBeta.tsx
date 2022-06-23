import Image from "next/image";
import PopulistLogoBeta from "public/images/logo-beta.svg";

export function LogoBeta({ ...rest }) {
  return (
    <Image
      src={PopulistLogoBeta}
      alt="Populist Beta"
      layout="responsive"
      objectFit="contain"
      priority
      {...rest}
    />
  );
}

