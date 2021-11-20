import React, {
  ForwardedRef,
  forwardRef,
  MutableRefObject,
  ReactNode,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { SanityDocument } from "@sanity/types";
// @ts-expect-error failed to get TS to accept this import
import sanityClient from "part:@sanity/base/client";
import {
  PreviewAction,
  PreviewDocument,
  PreviewQuery,
  PreviewState,
  usePreviewReducer,
} from "../hooks/preview-reducer-hook";
import { useDebouncedEffect } from "../hooks/debouce-hooks";
import styles from "./IFramePreviewBasic.css";
import { PreviewLoading } from "./PreviewLoading";
import classnames from "classnames";
import { useSetRefs } from "../hooks/set-refs-hook";
import { BasicPreviewProps } from "src/sanity-types";

export interface IFramePreviewBasicProps extends BasicPreviewProps {
  children?: ReactNode | undefined;
  options: {
    /**
     * Iframe url. By default sanity-iframe-api-react is enabled by passing
     * sanityPreview=true query-param.
     *
     *  Examples:
     *  * `'https://some-page.example/post?sanityPreview=true'`
     *  * `` (doc) => `https://some-page.example/${doc._id}?sanityPreview=true` ``
     *  * `` (doc) => Promise.resolve(`https://some-page.example/${doc.slug.current}/preview`) ``
     * */
    url:
      | string
      | Promise<string>
      | ((previewDocument: SanityDocument) => string)
      | ((previewDocument: SanityDocument) => Promise<string>);

    /** Map the SanityDocument available to the previewComponent prior to sending it to the iframe.
     * After the iframe responds with a groq-event, this method will no longer be invoked.*/
    mapDocument?: (
      previewDocument: SanityDocument
    ) => PreviewDocument | Promise<PreviewDocument>;

    /** When true, scroll in the iframe will be disabled */
    disableScroll?: boolean;

    /**
     * Minimum preview update time. Used to debounce document updates.
     * After updateDelay has passed, the component will execute the current GROQ query every
     * <updateDelay> ms, until up-to-date data is returned, or until  maxRevisionRetries is reached.
     *
     * In milliseconds. Default: 250 */
    updateDelay?: number;

    /**  Default: 5 */
    maxRevisionRetries?: number;
  };
}

const DEFAULT_UPDATE_DELAY = 250;
const DEFAULT_MAX_REVISION_RETRIES = 5;

interface IFramePreviewInternalProps extends IFramePreviewBasicProps {
  reload: () => void;
}

export const IFramePreviewBasic = forwardRef(function IFramePreviewBasic(
  props: IFramePreviewBasicProps,
  ref: ForwardedRef<HTMLIFrameElement>
) {
  if (!props.options?.url) {
    throw new Error(
      "IFramePreview requires props.options.url to be a string or Promise<string> "
    );
  }

  const id = props.document?.displayed?._id;
  const [key, setKey] = useState(id);
  const reload = useCallback(() => setKey(`${Math.random()}`), []);
  useEffect(() => {
    id !== key && setKey(id);
  }, [id, key]);

  return (
    <IFramePreviewInternal {...props} key={key} reload={reload} ref={ref}>
      {props.children}
    </IFramePreviewInternal>
  );
});

const IFramePreviewInternal = forwardRef(function IFramePreview(
  props: IFramePreviewInternalProps,
  forwardRef: ForwardedRef<HTMLIFrameElement>
) {
  const [state, dispatch] = usePreviewReducer(sanityClient);
  const url = useUrl(props.options.url, props.document.displayed);

  const ref = useRef<HTMLIFrameElement | null>(null);
  useIframeMessageListener(dispatch);
  useUpdatedPreviewDoc(
    props.document.displayed,
    props.options,
    state,
    dispatch
  );
  useUpdatedIframe(state, dispatch, ref, url);

  const [anyButtonPressed, mouseListener] = useMouseButtonListener();

  const setRefs = useSetRefs(ref, forwardRef);

  return (
    <div
      className={styles.preview}
      onMouseEnter={mouseListener}
      onMouseOver={mouseListener}
      onMouseLeave={mouseListener}
    >
      <PreviewLoading
        loading={state.loading}
        documentId={props.document?.displayed?._id}
        reload={props.reload}
      />
      <iframe
        scrolling={props.options.disableScroll ? "no" : undefined}
        style={{ pointerEvents: anyButtonPressed ? "none" : "auto" }}
        ref={setRefs}
        className={classnames([
          styles.iframe,
          !state.iframeReady && styles.iframeHidden,
        ])}
        title="Preview"
        src={url}
      />
      {props.children}
    </div>
  );
});

function useUrl(
  propsUrl: IFramePreviewBasicProps["options"]["url"],
  document?: SanityDocument
) {
  const [url, setUrl] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (!document) {
      return;
    }
    const resolveUrl =
      typeof propsUrl === "function" ? propsUrl(document) : propsUrl;
    Promise.resolve(resolveUrl).then((newUrl) => {
      if (newUrl !== url) {
        setUrl(newUrl);
      }
    });
  }, [url, propsUrl, document]);

  return url;
}

function useIframeMessageListener(dispatch: (action: PreviewAction) => void) {
  useEffect(() => {
    const listener = (e: { data?: { type: string } }) => {
      const eventType = e.data?.type;
      if (eventType === "ready") {
        dispatch({ type: "READY" });
      } else if (eventType === "groq") {
        const queryData = e.data as PreviewQuery;
        if (!queryData.query.includes("_rev")) {
          throw new Error(
            "GROQ query MUST contain an explicit _rev field as part of the projection. Query was: " +
              queryData.query
          );
        }
        dispatch({ type: "GROQ", groq: queryData });
      } else if (eventType === "updated") {
        dispatch({ type: "IFRAME_UPDATED" });
      }
    };
    window.addEventListener("message", listener, false);
    return () => window.removeEventListener("message", listener);
  });
}

function useUpdatedPreviewDoc(
  document: SanityDocument | undefined,
  {
    mapDocument,
    updateDelay = DEFAULT_UPDATE_DELAY,
    maxRevisionRetries = DEFAULT_MAX_REVISION_RETRIES,
  }: IFramePreviewBasicProps["options"],
  { sanityClient, groq, iframeReady }: PreviewState,
  dispatch: (action: PreviewAction) => void
) {
  const displayedDoc = document;
  const revision = document?._rev ?? "";

  useEffect(() => {
    if (!iframeReady || !revision) {
      return;
    }
    dispatch({ type: "WAIT_FOR_UPDATE" });
  }, [revision, iframeReady]);

  useDebouncedEffect(
    () => {
      if (!groq || !iframeReady || !displayedDoc) {
        return;
      }
      let canUpdate = true;
      const ensureRevision = (tries = 0) => {
        sanityClient.fetch(groq.query, groq.params).then((previewDocument) => {
          if (!canUpdate) {
            return;
          }

          const rev = previewDocument._rev;
          const isUpdated = !revision || !rev || revision === rev;
          const giveUp = tries >= maxRevisionRetries;
          if (isUpdated || giveUp) {
            dispatch({ type: "PREVIEW_DOC_UPDATED", previewDocument });
          } else {
            tries++;
            setTimeout(() => ensureRevision(tries), updateDelay);
          }
        });
      };
      ensureRevision();

      return () => {
        canUpdate = false;
      };
    },
    [
      displayedDoc,
      sanityClient,
      groq,
      iframeReady,
      revision,
      maxRevisionRetries,
    ],
    updateDelay * 2
  );

  useDebouncedEffect(
    () => {
      if (groq || !iframeReady || !displayedDoc) {
        return;
      }
      let canUpdate = true;

      let doc: PreviewDocument | Promise<PreviewDocument> = displayedDoc;
      if (mapDocument) {
        doc = mapDocument(displayedDoc);
      }

      Promise.resolve(doc).then(
        (previewDocument) =>
          canUpdate &&
          dispatch({
            type: "PREVIEW_DOC_UPDATED",
            previewDocument: { ...previewDocument, _id: displayedDoc._id },
          })
      );

      return () => {
        canUpdate = false;
      };
    },
    [mapDocument, displayedDoc, groq, iframeReady],
    updateDelay
  );
}

function useUpdatedIframe(
  { previewDocument, groq }: PreviewState,
  dispatch: (action: PreviewAction) => void,
  ref: MutableRefObject<HTMLIFrameElement | null>,
  url?: string
) {
  useEffect(() => {
    if (previewDocument && url) {
      const message = {
        _eventType: groq ? "groq-doc" : "doc",
        ...previewDocument,
      };
      ref.current?.contentWindow?.postMessage(message, new URL(url).origin);
    }
  }, [previewDocument, groq, url]);
}

function useMouseButtonListener() {
  const [anyButtonPressed, setAnyButtonPressed] = useState<boolean>(false);
  const mouseListener = useCallback(
    (e) => {
      const anyPressed = !!e.buttons;
      if (anyPressed !== anyButtonPressed) {
        setAnyButtonPressed(anyPressed);
      }
    },
    [anyButtonPressed]
  );
  return [anyButtonPressed, mouseListener] as [
    typeof anyButtonPressed,
    typeof mouseListener
  ];
}
