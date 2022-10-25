import Image from "next/legacy/image";
import PlusSvg from "public/images/add.svg";

export default function PlusIcon({ ...rest }) {
  return <Image src={PlusSvg} alt="Note" priority {...rest} />;
}
