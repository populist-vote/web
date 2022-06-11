import {
  useState,
  useEffect,
  useContext,
  createContext,
  ReactNode,
} from "react";
import { SHARED_GUIDES_LOCAL_STORAGE } from "utils/constants";

const SharedGuideIdsContext = createContext<string[]>([] as string[]);

function getGuideIds() {
  const rawSharedGuideIds = localStorage.getItem(SHARED_GUIDES_LOCAL_STORAGE);

  const sharedGuideIds = rawSharedGuideIds?.split("|") || "";

  return sharedGuideIds;
}

export function SharedGuidesProvider({ children }: { children: ReactNode }) {
  const currentSharedGuideIds = getGuideIds();

  const [sharedGuideIds, setSharedGuideIds] = useState(currentSharedGuideIds);

  useEffect(() => {
    setSharedGuideIds(currentSharedGuideIds);
  }, [currentSharedGuideIds, setSharedGuideIds]);

  return (
    <SharedGuideIdsContext.Provider value={sharedGuideIds}>
      {children}
    </SharedGuideIdsContext.Provider>
  );
}

export function useSharedGuideIds() {
  const sharedGuides = useContext(SharedGuideIdsContext);

  return sharedGuides;
}
