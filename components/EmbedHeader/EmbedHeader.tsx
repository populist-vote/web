import { BiChevronLeft } from "react-icons/bi";
import styles from "./EmbedHeader.module.scss";
import { useRouter } from "next/router";
import { EmbedType } from "generated";

export function EmbedHeader({
  embedType,
  backLink,
  title,
}: {
  embedType: EmbedType | "conversations";
  backLink?: string;
  title: string;
}) {
  const router = useRouter();
  return (
    <header className={styles.container}>
      <button
        onClick={() => (backLink ? router.push(backLink) : router.back())}
        onKeyDown={() => (backLink ? router.push(backLink) : router.back())}
      >
        <BiChevronLeft size={25} />
        {embedType.replace("_", " ")}
      </button>
      <h2>{title}</h2>
    </header>
  );
}
