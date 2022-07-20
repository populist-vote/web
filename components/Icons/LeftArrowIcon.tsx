import Image from "next/image";
import LeftArrowSVG from "public/images/LeftArrow40.svg";

export default function LeftArrowIcon({ ...rest }) {
  return <Image src={LeftArrowSVG} alt="Left Arrow" priority {...rest} />;
}
