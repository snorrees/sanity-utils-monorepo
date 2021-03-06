import React, { CSSProperties, RefObject, useEffect, useState } from "react";
import { useResizeObserver } from "../hooks/resize-observer";
import styles from "./IFrameOrientationControls.css";
import { Button, Inline } from "@sanity/ui";
import { DesktopIcon, MobileDeviceIcon } from "@sanity/icons";

export interface IFrameOrientationControlProps {
  desktopMinWidth?: number;
  containerRef: RefObject<HTMLDivElement>;
  iframeRef: RefObject<HTMLIFrameElement>;
}

export type Orientation = "horizontal" | "vertical";

export const orientations = ["vertical", "horizontal"] as const;

/**
 * Scales the iframe-wrapper by using css-transformations, so that
 * media-queries in the iframe will be above or below <desktopMinWidth> px, depending
 * on selected orientation.
 */
export function IFrameOrientationControls(
  props: IFrameOrientationControlProps
) {
  const [orientation, setOrientation] = useResponsiveScale(
    props.containerRef,
    props.iframeRef,
    props.desktopMinWidth
  );

  return props.desktopMinWidth ? (
    <div className={styles.controls}>
      <Inline space={[2]} style={{ textAlign: "center" }}>
        {orientations.map((or) => (
          <Button
            text={or === "vertical" ? "Mobile" : "Desktop"}
            icon={or === "vertical" ? MobileDeviceIcon : DesktopIcon}
            key={or}
            onClick={() => setOrientation(or)}
            size={3}
            padding={[3, 3, 4]}
            tone={or === orientation ? "primary" : undefined}
            mode={or !== orientation ? "ghost" : undefined}
          />
        ))}
      </Inline>
    </div>
  ) : null;
}

function useResponsiveScale(
  containerRef?: RefObject<HTMLDivElement>,
  iframeRef?: RefObject<HTMLIFrameElement>,
  minWidth?: number
) {
  const [orientation, setOrientation] = useState<Orientation>("vertical");
  const [containerSize, setContainerSize] = useState<DOMRect | undefined>();
  useResizeObserver(setContainerSize, containerRef?.current);

  useEffect(() => {
    const iframeStyle = iframeRef?.current?.style;
    if (!containerSize || !minWidth || !iframeStyle) {
      return;
    }
    let sizeStyle: CSSProperties = {
      maxWidth: "unset",
      marginLeft: "unset",
      width: "100%",
      height: "100%",
      transform: "unset",
    };

    const scale = minWidth / containerSize.width;
    if (scale < 1 && orientation === "vertical") {
      sizeStyle = {
        ...sizeStyle,
        maxWidth: `${minWidth - 1}px`,
        marginLeft: `${(containerSize.width - minWidth) / 2}px`,
      };
    } else if (scale > 1 && orientation === "horizontal") {
      const scalePercentage = scale * 100;
      const translatePercentage = ((100 - scalePercentage) / 2) * -1;
      sizeStyle = {
        ...sizeStyle,
        width: `${scalePercentage}%`,
        height: `${scalePercentage}%`,
        transform: `scale(${1 / scale}) 
      translate(-${translatePercentage}%, -${translatePercentage}%)`,
      };
    }

    Object.assign(iframeStyle, sizeStyle);
  }, [containerSize, minWidth, orientation, containerRef, iframeRef]);

  return [orientation, setOrientation] as [
    typeof orientation,
    typeof setOrientation
  ];
}
