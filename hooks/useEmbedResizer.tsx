import { useEffect } from "react";
import { IResizeHeightMessage, emitData } from "utils/messages";

export function useEmbedResizer({
  origin,
  embedId,
}: {
  origin: string;
  embedId: string;
}) {
  return useEffect(() => {
    const observer = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (!entry) return;
      emitData<IResizeHeightMessage>(
        { resizeHeight: entry.contentRect.height, embedId },
        origin
      );
    });

    observer.observe(document.querySelector("body") as HTMLBodyElement);
    return () => observer.disconnect();
  }, [origin, embedId]);
}
