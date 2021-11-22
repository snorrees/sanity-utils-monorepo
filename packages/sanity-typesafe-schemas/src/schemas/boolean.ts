import { Options, SanitySchemaBase } from "./util-types/common";
import { BooleanSchemaType } from "@sanity/types";
import { Rule, Validation } from "./util-types/validation";
import { InitialValueProperty } from "@sanity/types";

/**
 * [Boolean docs]{@link https://www.sanity.io/docs/boolean-type }.
 */
export interface BooleanSchema extends SanitySchemaBase {
  type: "boolean";
  options?: BooleanOptions;

  /** [Validation docs](https://www.sanity.io/docs/validation) */
  validation?: (rule: BooleanRule) => Validation<BooleanRule>;

  /** [Initial value docs](https://www.sanity.io/docs/initial-value-templates) */
  initialValue?: InitialValueProperty<boolean>;
}

export type BooleanRule = Rule<BooleanRule>;
export type BooleanOptions = Partial<Options<BooleanSchemaType>>;
