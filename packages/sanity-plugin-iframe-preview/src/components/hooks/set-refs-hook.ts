import { ForwardedRef, MutableRefObject, useCallback } from "react";

export function useSetRefs<T>(
  ref: MutableRefObject<T>,
  forwardRef: ForwardedRef<T>
) {
  return useCallback((e: T) => {
    ref.current = e;
    if (typeof forwardRef === "function") {
      forwardRef(e);
    } else if (typeof forwardRef === "object" && forwardRef !== null) {
      forwardRef.current = e;
    }
  }, []);
}
