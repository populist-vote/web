import Image from "next/legacy/image";
import FiltersIconSVG from "public/images/FiltersIcon.svg";

export default function NoteIcon({ ...rest }) {
  return <Image src={FiltersIconSVG} alt="Filters" priority {...rest} />;
}
