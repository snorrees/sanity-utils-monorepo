import { StringSchema } from "../schemas/string";
import { ReactNode } from "react";

export type SpecialStringSchema = Omit<StringSchema, "type"> & {
  type: "special-string";
  options: {
    special: string;
  };
};

declare module "../schemas/document" {
  interface DocumentSchema {
    previewComponent?: ReactNode;
    options?: {
      custom?: boolean;
    };
  }
}
