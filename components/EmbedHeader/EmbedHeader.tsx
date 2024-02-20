import { BiChevronLeft } from "react-icons/bi";
import styles from "./EmbedHeader.module.scss";
import { useRouter } from "next/router";
import { EmbedType } from "generated";

export function EmbedHeader({
  embedType,
  title,
}: {
  embedType: EmbedType;
  title: string;
}) {
  const router = useRouter();
  return (
    <header className={styles.container}>
      <button onClick={() => router.back()} onKeyDown={() => router.back()}>
        <BiChevronLeft size={20} />
        {embedType.replace("_", " ")}
      </button>
      <h2>{title}</h2>
    </header>
  );
}
