import Image from "next/image";
import AddIcon from "public/images/icons/Add.svg";

export default function Add({ ...rest }) {
  return (
    <Image
      src={AddIcon}
      alt="Add"
      layout="responsive"
      objectFit="contain"
      priority
      {...rest}
    />
  );
}
