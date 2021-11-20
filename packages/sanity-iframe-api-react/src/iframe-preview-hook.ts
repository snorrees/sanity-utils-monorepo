import { useEffect, useState } from "react";
import type { PreviewConfig } from "sanity-iframe-api-alpha";

function isPreviewEnabled() {
  if (typeof window !== "undefined") {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get("sanityPreview") === "true";
  }
  return false;
}

type PreviewHookConfig<T> = PreviewConfig<T> & {
  /*
   * Will load & initialize the iframe api only when this function resolves to true.
   * */
  enabled?: () => boolean | Promise<boolean>;
};

export function usePreviewData<T>(config: PreviewHookConfig<T>) {
  const [data, setData] = useState(config.initialData);

  useEffect(() => {
    if (!isPreviewEnabled()) {
      return;
    }
    import("sanity-iframe-api-alpha").then((module) => {
      module.initPreview(config, setData);
    });
  }, [
    setData,
    config.groqQuery,
    config.queryParams,
    config.sanityClientVersion,
  ]);

  return data;
}
