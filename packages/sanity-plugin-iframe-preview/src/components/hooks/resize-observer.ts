import { useLayoutEffect, useState } from 'react';

function singleEntryObserver(onChange: (rect: DOMRect) => void) {
  return new ResizeObserver((entries) => {
    for (const entry of entries) {
      onChange(entry.target.getBoundingClientRect());
      if (entry) {
        break;
      }
    }
  });
}

export function useResizeObserver<T extends HTMLElement>(
  onChange: (rect: DOMRect) => void,
  domNode?: T | null
) {
  const [observer, setObserver] = useState<ResizeObserver | undefined>();

  useLayoutEffect(() => {
    if (!domNode) {
      return;
    }

    let co = observer;
    let canUpdate = true;
    if (!co) {
      co = singleEntryObserver((rect: DOMRect) => {
        canUpdate && onChange(rect);
      });
      setObserver(co);
    }
    co.disconnect();
    co.observe(domNode);

    return () => {
      canUpdate = false;
      co?.disconnect();
    };
  }, [domNode]);
}
