import { BiChevronLeft } from "react-icons/bi";
import styles from "./EmbedHeader.module.scss";
import { useRouter } from "next/router";

export function EmbedHeader({
  embedType,
  title,
}: {
  embedType: "politician" | "legislation" | "question" | "poll";
  title: string;
}) {
  const router = useRouter();
  return (
    <header className={styles.container}>
      <button onClick={() => router.back()} onKeyDown={() => router.back()}>
        <BiChevronLeft size={20} />
        {embedType}
      </button>
      <h2>{title}</h2>
    </header>
  );
}
