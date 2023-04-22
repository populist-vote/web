import { useRouter } from "next/router";

type Theme = "yellow" | "aqua" | "orange";

function useTheme(): { theme: Theme } {
  const router = useRouter();
  const theme =
    router.query["embed-type"] === "legislation"
      ? "yellow"
      : router.query["embed-type"] === "multi-legislation"
      ? "orange"
      : router.query["embed-type"] === "politician"
      ? "aqua"
      : "yellow";

  return { theme };
}

export { useTheme };
