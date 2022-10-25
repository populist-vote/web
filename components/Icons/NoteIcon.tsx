import Image from "next/legacy/image";
import NoteIconSVG from "public/images/NoteIcon.svg";

export default function NoteIcon({ ...rest }) {
  return <Image src={NoteIconSVG} alt="Note" priority {...rest} />;
}
