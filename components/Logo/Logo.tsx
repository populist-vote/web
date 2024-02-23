import Image from "next/legacy/image";
import PopulistLogo from "public/images/Logo.svg";

function Logo({ ...rest }) {
  return <Image src={PopulistLogo} alt="Populist" priority {...rest} />;
}

export { Logo };
