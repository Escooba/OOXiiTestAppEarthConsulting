import { useEffect, useRef, useCallback, useState } from 'react';

export function useAutoAdvance(delayMs: number = 1200, fadeDurationMs: number = 200) {
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const fadeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isMounted = useRef(true);

  const [isAdvancing, setIsAdvancing] = useState(false);
  const [isFading, setIsFading] = useState(false);

  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      if (fadeTimeoutRef.current) clearTimeout(fadeTimeoutRef.current);
    };
  }, []);

  const commitAndAdvance = useCallback((callback: () => void) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    if (fadeTimeoutRef.current) clearTimeout(fadeTimeoutRef.current);

    setIsAdvancing(true);
    setIsFading(false);

    const fadeDelay = Math.max(0, delayMs - fadeDurationMs);

    fadeTimeoutRef.current = setTimeout(() => {
      if (isMounted.current) {
        setIsFading(true);
      }
    }, fadeDelay);

    timeoutRef.current = setTimeout(() => {
      if (isMounted.current) {
        callback();
      }
    }, delayMs);
  }, [delayMs, fadeDurationMs]);

  const clearAdvance = useCallback(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    if (fadeTimeoutRef.current) clearTimeout(fadeTimeoutRef.current);
    timeoutRef.current = null;
    fadeTimeoutRef.current = null;
    setIsAdvancing(false);
    setIsFading(false);
  }, []);

  return { commitAndAdvance, clearAdvance, isAdvancing, isFading };
}
