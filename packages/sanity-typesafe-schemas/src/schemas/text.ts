import { EnumListProps, SanitySchemaBase } from "./util-types/common";
import { Rule, Validation } from "./util-types/validation";
import { InitialValueProperty } from "@sanity/types/src/schema/types";

/**
 * [String docs]{@link https://www.sanity.io/docs/text-type}
 */
export interface TextSchema extends SanitySchemaBase {
  type: "string";
  options?: StringOptions;

  /** [Validation docs](https://www.sanity.io/docs/validation) */
  validation?: (rule: StringRule) => Validation<StringRule>;

  /** [Initial value docs](https://www.sanity.io/docs/initial-value-templates) */
  initialValue?: InitialValueProperty<string>;
}

export type StringOptions = EnumListProps<string>;

/** [String validation docs]{@link https://www.sanity.io/docs/string-type#required()-f5fd99d2b4c6} */
export interface StringRule extends Rule<StringRule> {
  /** [String validation docs]{@link https://www.sanity.io/docs/string-type#required()-f5fd99d2b4c6} */
  min: (length: number) => StringRule;
  /** [String validation docs]{@link https://www.sanity.io/docs/string-type#required()-f5fd99d2b4c6} */
  max: (length: number) => StringRule;
  /** [String validation docs]{@link https://www.sanity.io/docs/string-type#required()-f5fd99d2b4c6} */
  length: (length: number) => StringRule;
  /** [String validation docs]{@link https://www.sanity.io/docs/string-type#required()-f5fd99d2b4c6} */
  uppercase: () => StringRule;
  /** [String validation docs]{@link https://www.sanity.io/docs/string-type#required()-f5fd99d2b4c6} */
  lowercase: () => StringRule;
  /** [String validation docs]{@link https://www.sanity.io/docs/string-type#required()-f5fd99d2b4c6} */
  regex: (
    pattern: string | RegExp,
    options?: {
      /**
       * Providing a name will make the message more understandable to the user '
       * ("Does not match the <name>-pattern").
       */
      name?: string;
      invert?: boolean;
    }
  ) => StringRule;
}
