import Image from "next/image";
import StarSvg from "public/images/star-grey-darker.svg";

export default function StarGreyDarkerIcon({ ...rest }) {
  return <Image src={StarSvg} alt="Note" priority {...rest} />;
}
