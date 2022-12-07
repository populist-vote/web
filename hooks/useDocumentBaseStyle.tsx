import { useMemo } from "react";

export default function useDocumentBaseStyle() {
  const style = useMemo(() => getComputedStyle(document.body), []);
  return style;
}
