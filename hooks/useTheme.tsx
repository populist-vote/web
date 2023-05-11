import { useRouter } from "next/router";

type Theme = "yellow" | "aqua" | "orange" | "violet";

function useTheme(): { theme: Theme } {
  const router = useRouter();
  const theme = router.asPath.includes("legislation")
    ? "yellow"
    : router.asPath.includes("politician")
    ? "aqua"
    : router.asPath.includes("question")
    ? "orange"
    : router.asPath.includes("poll")
    ? "violet"
    : "yellow";

  return { theme };
}

export { useTheme };
