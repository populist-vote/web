import Image from "next/image";
import RightArrowSVG from "public/images/RightArrow40.svg";

export default function RightArrowIcon({ ...rest }) {
  return <Image src={RightArrowSVG} alt="Left Arrow" priority {...rest} />;
}
