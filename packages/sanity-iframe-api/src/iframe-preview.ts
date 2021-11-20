import { PreviewConfig, MessageEvent } from "./types";

export function initPreview<T>(
  {
    origin = "*",
    groqQuery,
    sanityClientVersion,
    queryParams = (d) => ({ id: d._id }),
  }: PreviewConfig<T>,
  setData: (data: T) => void
) {
  function createMessageListener() {
    return async (event: MessageEvent) => {
      const id = event.data._id;
      const eventType = event.data._eventType;

      if (!id || !eventType) {
        return;
      }

      if (eventType === "doc") {
        if (!groqQuery) {
          // When no groqQuery is configured, just use the document provided by
          // Sanity Studio directly.
          setData(event.data as unknown as T);
          return;
        }

        return sendGROQ(
          groqQuery,
          queryParams(event.data),
          sanityClientVersion,
          origin
        );
      }

      if (eventType === "groq-doc") {
        setData(event.data as unknown as T);
        return window.parent?.postMessage({ type: "updated" }, origin);
      }
    };
  }

  const eventListener = createMessageListener();
  window.addEventListener("message", eventListener, false);

  // Sanity Content Studio will not send previewDoc before this event has been sent
  window.parent?.postMessage({ type: "ready" }, origin);
  window.parent?.postMessage({ type: "updated" }, origin);

  return () => window.removeEventListener("message", eventListener);
}

function sendGROQ(
  groqQuery: PreviewConfig<unknown>["groqQuery"],
  params: Record<string, unknown>,
  sanityClientVersion = "2021-06-01",
  origin: string
) {
  const resolveQuery =
    typeof groqQuery === "function" ? groqQuery() : groqQuery;
  Promise.resolve(resolveQuery).then((query) => {
    window.parent?.postMessage(
      {
        type: "groq",
        query: query,
        params,
        clientVersion: sanityClientVersion,
      },
      origin
    );
  });
}
