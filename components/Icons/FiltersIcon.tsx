import Image from "next/legacy/image";
import FiltersIconSVG from "public/images/FiltersIcon.svg";

export default function NoteIcon({ size, ...rest }: { size?: number }) {
  const width = size || "20";
  const height = size || "20";
  return (
    <Image
      src={FiltersIconSVG}
      alt="Filters"
      priority
      width={width}
      height={height}
      {...rest}
    />
  );
}
