import { useState, useEffect } from "react";
import { SAVED_GUIDES_LOCAL_STORAGE } from "utils/constants";

export const getGuideStorageKey = (userId: string) =>
  `${SAVED_GUIDES_LOCAL_STORAGE}-${userId}`;

function getGuideIds(userId: string) {
  const rawSavedGuideIds = (() => {
    try {
      return localStorage.getItem(getGuideStorageKey(userId));
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
        { rawSavedGuideIds },
        err
      );
      localStorage.removeItem(getGuideStorageKey(userId));
      return [];
    }
  })();

  return savedGuideIds;
}

export function useSavedGuideIds(userId: string): {
  savedGuideIds: string[];
  addSavedGuideId: (id: string) => void;
  removeSavedGuide: (index: number) => void;
} {
  const [savedGuideIds, setSavedGuideIds] = useState<string[]>(
    getGuideIds(userId)
  );

  const addSavedGuideId = (newId: string) => {
    if (savedGuideIds.indexOf(newId) === -1) {
      setSavedGuideIds([...savedGuideIds, newId]);
    }
  };

  const removeSavedGuide = (index: number) => {
    if (index > savedGuideIds.length - 1) return;
    const newList = [
      ...savedGuideIds.slice(0, index),
      ...savedGuideIds.slice(index + 1),
    ];
    setSavedGuideIds(newList);
  };

  useEffect(() => {
    if (savedGuideIds.length > 0) {
      const joinedIds = JSON.stringify(savedGuideIds);
      localStorage.setItem(getGuideStorageKey(userId), joinedIds);
    }
  }, [savedGuideIds, userId]);

  return { savedGuideIds, addSavedGuideId, removeSavedGuide };
}
