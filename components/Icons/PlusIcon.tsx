import Image from "next/image";
import PlusSvg from "public/images/add.svg";

export default function PlusIcon({ ...rest }) {
  return <Image src={PlusSvg} alt="Note" priority {...rest} />;
}
