import Image from "next/legacy/image";
import PopulistLogoBeta from "public/images/logo-beta.svg";

function LogoBeta({ ...rest }) {
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

export { LogoBeta };
