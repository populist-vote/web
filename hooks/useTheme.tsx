import { useRouter } from "next/router";

type Theme = "yellow" | "aqua" | "orange";

function useTheme(): { theme: Theme } {
  const router = useRouter();
  const theme = router.asPath.includes("legislation")
    ? "yellow"
    : router.asPath.includes("politician")
    ? "aqua"
    : router.asPath.includes("question")
    ? "orange"
    : "yellow";

  return { theme };
}

export { useTheme };
