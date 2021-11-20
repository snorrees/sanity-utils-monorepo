import React, { ForwardedRef, forwardRef, useRef } from "react";
import {
  IFramePreviewBasic,
  IFramePreviewBasicProps,
} from "./basic/IFramePreviewBasic";
import { IFrameOrientationControls } from "./responsive/IFrameOrientationControls";
import { useSetRefs } from "./hooks/set-refs-hook";
import styles from "./IFramePreview.css";

export type IFramePreviewProps = IFramePreviewBasicProps & {
  options: {
    desktopMinWidth?: number;
  };
};

export const IFramePreview = forwardRef(function IFramePreview(
  props: IFramePreviewProps,
  forwardRef: ForwardedRef<HTMLIFrameElement>
) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const { options, ...restProps } = props;
  const { desktopMinWidth, ...restOptions } = options;

  const setRefs = useSetRefs(iframeRef, forwardRef);
  return (
    <div ref={containerRef} className={styles.preview}>
      <IFramePreviewBasic {...restProps} options={restOptions} ref={setRefs}>
        <IFrameOrientationControls
          iframeRef={iframeRef}
          containerRef={containerRef}
          desktopMinWidth={desktopMinWidth}
        />
      </IFramePreviewBasic>
    </div>
  );
});
