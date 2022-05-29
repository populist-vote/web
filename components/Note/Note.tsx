import Image from "next/image";
import NoteIcon from "public/images/icons/Note.svg";

export default function Note({ ...rest }) {
  return (
    <Image
      src={NoteIcon}
      alt="Note"
      layout="responsive"
      objectFit="contain"
      priority
      {...rest}
    />
  );
}
