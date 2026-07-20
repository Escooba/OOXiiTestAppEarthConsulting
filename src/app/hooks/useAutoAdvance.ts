import { useEffect, useRef, useCallback } from 'react';

export function useAutoAdvance(delayMs: number = 400) {
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isMounted = useRef(true);

  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const commitAndAdvance = useCallback((callback: () => void) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    timeoutRef.current = setTimeout(() => {
      if (isMounted.current) {
        callback();
      }
    }, delayMs);
  }, [delayMs]);

  const clearAdvance = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  return { commitAndAdvance, clearAdvance };
}
