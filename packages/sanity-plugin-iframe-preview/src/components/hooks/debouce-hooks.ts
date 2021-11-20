import { useCallback, useEffect } from "react";

export const useDebouncedEffect = (
  effect: () => void | (() => void),
  deps: unknown[],
  delay: number
) => {
  const callback = useCallback(effect, deps);

  useEffect(() => {
    let cleanup: undefined | void | (() => void);
    const handler = setTimeout(() => {
      cleanup = callback();
    }, delay);

    return () => {
      clearTimeout(handler);
      typeof cleanup === "function" && cleanup();
    };
  }, [callback, delay]);
};
