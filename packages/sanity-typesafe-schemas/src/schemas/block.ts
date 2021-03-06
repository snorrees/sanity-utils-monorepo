import { ReactNode } from "react";
import { PartialBy, SanitySchemaBase } from "./util-types/common";
import { Rule, Validation } from "./util-types/validation";
import { InitialValueProperty } from "@sanity/types/src/schema/types";

interface BlockStyle {
  title: string;
  value:
    | "H1"
    | "H2"
    | "H3"
    | "H4"
    | "H5"
    | "H6"
    | "blockquote"
    | "normal"
    | string;
  blockEditor?: {
    render(props: unknown): ReactNode;
  };
}

interface BlockList {
  title: string;
  value: "bullet" | "number" | string;
}

interface Decorator {
  title: string;
  value: "strong" | "em" | "code" | "underline" | "strike-through" | string;
  icon?: ReactNode;
}

type Annotations = PartialBy<SanitySchemaBase, "name"> & {
  fields?: unknown[];
  blockEditor?: {
    icon?: (props?: unknown) => ReactNode;
  };
};

interface Marks {
  /**
   * [Block type docs]{@link https://www.sanity.io/docs/block-type}.
   *
   * [Configure block type]{@link https://www.sanity.io/docs/configuration}.
   *
   * [Customize block type]{@link https://www.sanity.io/docs/customization}.
   */
  decorators?: ReadonlyArray<Decorator>;

  /**
   * [Block type docs]{@link https://www.sanity.io/docs/block-type}.
   *
   * [Configure block type]{@link https://www.sanity.io/docs/configuration}.
   *
   * [Customize block type]{@link https://www.sanity.io/docs/customization}.
   */
  annotations?: ReadonlyArray<Annotations>;
}

/**
 * [Block type docs]{@link https://www.sanity.io/docs/block-type}.
 *
 * [Configure block type]{@link https://www.sanity.io/docs/configuration}.
 *
 * [Customize block type]{@link https://www.sanity.io/docs/customization}.
 */
export interface BlockSchema extends SanitySchemaBase {
  /** block must live inside array */
  type: "block";

  /** [Validation docs](https://www.sanity.io/docs/validation) */
  validation?: (rule: BlockRule) => Validation<BlockRule>;

  /** [Initial value docs](https://www.sanity.io/docs/initial-value-templates) */
  initialValue?: InitialValueProperty<Record<string, unknown>>;

  /**
   * [Block type docs]{@link https://www.sanity.io/docs/block-type}.
   *
   * [Configure block type]{@link https://www.sanity.io/docs/configuration}.
   *
   * [Customize block type]{@link https://www.sanity.io/docs/customization}.
   */
  styles?: BlockStyle[];

  /**
   * [Block type docs]{@link https://www.sanity.io/docs/block-type}.
   *
   * [Configure block type]{@link https://www.sanity.io/docs/configuration}.
   *
   * [Customize block type]{@link https://www.sanity.io/docs/customization}.
   */
  lists?: BlockList[];

  /**
   * [Block type docs]{@link https://www.sanity.io/docs/block-type}.
   *
   * [Configure block type]{@link https://www.sanity.io/docs/configuration}.
   *
   * [Customize block type]{@link https://www.sanity.io/docs/customization}.
   */
  marks?: Marks;
}

export type BlockRule = Rule<BlockRule>;
