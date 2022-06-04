import Image from "next/image";
import NoteIconSVG from "public/images/NoteIcon.svg";

export default function NoteIcon({ ...rest }) {
  return (
    <Image
      src={NoteIconSVG}
      alt="Note"
      objectFit="contain"
      priority
      {...rest}
    />
  );
}
