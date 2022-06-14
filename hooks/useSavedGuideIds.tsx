import { useState, useEffect } from "react";
import { SHARED_GUIDES_LOCAL_STORAGE } from "utils/constants";

function getGuideIds() {
  const rawSavedGuideIds = localStorage.getItem(SHARED_GUIDES_LOCAL_STORAGE);

  const savedGuideIds: string[] = (() => {
    try {
      return JSON.parse(rawSavedGuideIds || "[]") || [];
    } catch (err) {
      console.error(
        "Problem parsing shared guides, returning empty array...",
        err
      );
      return [];
    }
  })();

  return savedGuideIds;
}

export function useSavedGuideIds() {
  const [savedGuideIds, setSavedGuideIds] = useState<string[]>(getGuideIds());
  // const currentSavedGuideIds = getGuideIds(setSavedGuideIds);

  const addSavedGuideId = (newId: string) => {
    if (savedGuideIds.indexOf(newId) !== -1) {
      setSavedGuideIds([...savedGuideIds, newId]);
    }
  };

  useEffect(() => {
    if (savedGuideIds.length > 0) {
      const joinedIds = JSON.stringify(savedGuideIds);
      localStorage.setItem(SHARED_GUIDES_LOCAL_STORAGE, joinedIds);
    }
  }, [savedGuideIds, setSavedGuideIds]);

  return { savedGuideIds, addSavedGuideId };
}
