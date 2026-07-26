import { useEffect, useRef, useCallback, useState } from 'react';

export function useAutoAdvance(delayMs: number = 500) {
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isMounted = useRef(true);

  const [isAdvancing, setIsAdvancing] = useState(false);

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
    
    setIsAdvancing(true);
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
      setIsAdvancing(false);
    }
  }, []);

  return { commitAndAdvance, clearAdvance, isAdvancing };
}
