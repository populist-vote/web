import Image from "next/image";
import StarSvg from "public/images/star.svg";

export default function StarIcon({ ...rest }) {
  return <Image src={StarSvg} alt="Note" priority {...rest} />;
}
