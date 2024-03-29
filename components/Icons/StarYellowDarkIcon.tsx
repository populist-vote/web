import Image from "next/legacy/image";
import StarSvg from "public/images/star-yellow-dark.svg";

export default function StarYellowDarkIcon({ ...rest }) {
  return <Image src={StarSvg} alt="Note" priority {...rest} />;
}
