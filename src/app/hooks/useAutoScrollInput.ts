import { useEffect, useRef } from 'react';

/**
 * Hook to automatically scroll the primary input card/container into view
 * when progressing between test sections.
 */
export function useAutoScrollInput<T extends HTMLElement = HTMLDivElement>() {
  const ref = useRef<T>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (ref.current) {
        ref.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 150);
    return () => clearTimeout(timer);
  }, []);

  return ref;
}
