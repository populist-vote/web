import Image from "next/image";
import StarSvg from "public/images/star-grey-dark.svg";

export default function StarGreyDarkIcon({ ...rest }) {
  return <Image src={StarSvg} alt="Note" priority {...rest} />;
}
