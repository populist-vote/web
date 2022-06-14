import {
  useState,
  useEffect,
  useContext,
  createContext,
  ReactNode,
  Dispatch,
  SetStateAction,
} from "react";
import { SHARED_GUIDES_LOCAL_STORAGE } from "utils/constants";

const SHARED_GUIDES_INITIAL_STATE = [""];

interface SharedGuideIdsContextResult {
  sharedGuideIds: string[];
  setSharedGuideIds: Dispatch<SetStateAction<string[]>>;
  addSharedGuideId: (newID: string) => void;
}

const SharedGuideIdsContext = createContext<SharedGuideIdsContextResult>(
  {} as SharedGuideIdsContextResult
);

function getGuideIds() {
  const rawSharedGuideIds = localStorage.getItem(SHARED_GUIDES_LOCAL_STORAGE);

  const sharedGuideIds =
    rawSharedGuideIds?.split("|") || SHARED_GUIDES_INITIAL_STATE;

  return sharedGuideIds;
}

export function SharedGuidesProvider({ children }: { children: ReactNode }) {
  const currentSharedGuideIds = getGuideIds();

  const [sharedGuideIds, setSharedGuideIds] = useState(currentSharedGuideIds);

  const addSharedGuideId = (newId: string) => {
    if (sharedGuideIds.indexOf(newId) !== -1) {
      setSharedGuideIds([...sharedGuideIds, newId]);
    }
  };

  useEffect(() => {
    if (sharedGuideIds !== SHARED_GUIDES_INITIAL_STATE) {
      const joinedIds = sharedGuideIds.join("|");
      console.log("setting localStorage guides to: ", joinedIds);
      localStorage.setItem(SHARED_GUIDES_LOCAL_STORAGE, joinedIds);
    }
  }, [sharedGuideIds, setSharedGuideIds]);

  return (
    <SharedGuideIdsContext.Provider
      value={{ sharedGuideIds, setSharedGuideIds, addSharedGuideId }}
    >
      {children}
    </SharedGuideIdsContext.Provider>
  );
}

export function useSharedGuideIds() {
  const sharedGuides = useContext(SharedGuideIdsContext);

  return sharedGuides;
}
