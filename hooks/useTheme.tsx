import { useRouter } from "next/router";

export type Theme = "yellow" | "aqua" | "blue" | "orange" | "violet" | "green";

function useTheme(): { theme: Theme } {
  const router = useRouter();
  const theme = router.asPath.includes("legislation-tracker")
    ? "green"
    : router.asPath.includes("legislation")
      ? "yellow"
      : router.asPath.includes("politician") ||
          router.asPath.includes("candidate-guide")
        ? "aqua"
        : router.asPath.includes("race")
          ? "blue"
          : router.asPath.includes("question")
            ? "orange"
            : router.asPath.includes("poll")
              ? "violet"
              : "yellow";

  return { theme };
}

export { useTheme };
