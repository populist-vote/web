import { useEffect, useState } from "react";
import useSSR from "./useSsr";

const createElement = (id: string): HTMLElement => {
  const el = document.createElement("div");
  el.setAttribute("id", id);
  return el;
};

const usePortal = (
  selectId: string = Math.random().toString(32).slice(2, 10),
  getContainer?: () => HTMLElement | null
): HTMLElement | null => {
  const id = `portal-${selectId}`;
  const { isBrowser } = useSSR();
  const [elSnapshot, setElSnapshot] = useState<HTMLElement | null>(
    isBrowser ? createElement(id) : null
  );

  useEffect(() => {
    const customContainer = getContainer ? getContainer() : null;
    const parentElement = customContainer || document.body;
    const hasElement = parentElement.querySelector<HTMLElement>(`#${id}`);
    const el = hasElement || createElement(id);

    if (!hasElement) {
      parentElement.appendChild(el);
    }
    setElSnapshot(el);
  }, [id, getContainer]);

  return elSnapshot;
};

export default usePortal;
