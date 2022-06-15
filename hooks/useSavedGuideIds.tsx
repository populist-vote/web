import { useState, useEffect } from "react";
import { SAVED_GUIDES_LOCAL_STORAGE } from "utils/constants";

function getGuideIds() {
  const rawSavedGuideIds = (() => {
    try {
      return localStorage.getItem(SAVED_GUIDES_LOCAL_STORAGE);
    } catch (err) {
      console.error("Problem reading localStorage", err);
      return undefined;
    }
  })();

  const savedGuideIds: string[] = (() => {
    if (!rawSavedGuideIds) return [];
    try {
      return JSON.parse(rawSavedGuideIds || "[]") || [];
    } catch (err) {
      console.error(
        "Problem parsing shared guides, resetting saved guides in local storage...",
        err
      );
      localStorage.removeItem(SAVED_GUIDES_LOCAL_STORAGE);
      return [];
    }
  })();

  return savedGuideIds;
}

export function useSavedGuideIds() {
  const [savedGuideIds, setSavedGuideIds] = useState<string[]>(getGuideIds());

  const addSavedGuideId = (newId: string) => {
    if (savedGuideIds.indexOf(newId) === -1) {
      setSavedGuideIds([...savedGuideIds, newId]);
    }
  };

  useEffect(() => {
    if (savedGuideIds.length > 0) {
      const joinedIds = JSON.stringify(savedGuideIds);
      localStorage.setItem(SAVED_GUIDES_LOCAL_STORAGE, joinedIds);
    }
  }, [savedGuideIds]);

  return { savedGuideIds, addSavedGuideId };
}
