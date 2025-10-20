import { useEffect, useState, useCallback, useRef } from "react";

interface UseHashNavigationProps {
  offset?: number;
  threshold?: number[];
  debounceMs?: number;
}

export function useHashRoutes({
  offset = 136, // Default header offset
  threshold = [0, 0.25, 0.5, 0.75, 1],
  debounceMs = 100,
}: UseHashNavigationProps = {}) {
  const [activeSection, setActiveSection] = useState<string>("");
  const isScrollingRef = useRef(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  // Debounced history update to prevent rapid hash changes
  const updateHistory = useCallback(
    (sectionId: string) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        if (!isScrollingRef.current && sectionId !== activeSection) {
          setActiveSection(sectionId);
          window.history.replaceState(
            null,
            "",
            sectionId ? `#${sectionId}` : window.location.pathname
          );
        }
      }, debounceMs);
    },
    [activeSection, debounceMs]
  );

  // Smooth scroll handler with improved behavior
  const scrollToSection = useCallback(
    (sectionId: string) => {
      const section = document.getElementById(sectionId);
      if (!section) return;

      isScrollingRef.current = true;

      // Calculate scroll position with offset
      const sectionTop = section.getBoundingClientRect().top;
      const offsetPosition = sectionTop + (window.scrollY - offset - 16);

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });

      // Reset scrolling flag after animation
      setTimeout(() => {
        isScrollingRef.current = false;
        setActiveSection(sectionId);
      }, 1000); // Typical smooth scroll duration
    },
    [offset]
  );

  // Setup intersection observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (isScrollingRef.current) return;

        // Find the most visible section
        let maxRatio = 0;
        let mostVisibleSection = "";

        entries.forEach((entry) => {
          if (entry.intersectionRatio > maxRatio) {
            maxRatio = entry.intersectionRatio;
            mostVisibleSection = entry.target.id;
          }
        });

        if (mostVisibleSection && maxRatio > 0.25) {
          updateHistory(mostVisibleSection);
        }
      },
      {
        rootMargin: `-${offset}px 0px -${window.innerHeight - offset - 100}px 0px`,
        threshold,
      }
    );

    observerRef.current = observer;

    // Observe all sections with IDs
    const sections = document.querySelectorAll("section[id]");
    sections.forEach((section) => observer.observe(section));

    return () => {
      sections.forEach((section) => observer.unobserve(section));
      observer.disconnect();
    };
  }, [offset, threshold, updateHistory]);

  // Handle initial hash scroll
  useEffect(() => {
    if (window.location.hash) {
      const sectionId = window.location.hash.slice(1);
      // Small delay to ensure page is ready
      setTimeout(() => scrollToSection(sectionId), 100);
    }
  }, [scrollToSection]);

  return {
    activeSection,
    scrollToSection,
  };
}
