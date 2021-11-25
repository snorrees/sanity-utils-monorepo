import { ReactNode } from "react";

declare module "../schemas/document" {
  interface DocumentSchema {
    previewComponent?: ReactNode;
    options?: {
      custom?: boolean;
    };
  }
}
