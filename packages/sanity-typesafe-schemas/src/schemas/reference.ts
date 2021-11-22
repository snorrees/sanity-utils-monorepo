/**
 * [Reference docs](https://www.sanity.io/docs/reference-type)
 */
import { PartialBy, SanitySchemaBase } from "./util-types/common";
import { Rule, Validation } from "./util-types/validation";
import { InitialValueProperty } from "@sanity/types/src/schema/types";
import { ReferenceFilterResolver } from "@sanity/types/src/reference/types";

type SchemaOptionalName = PartialBy<SanitySchemaBase, "name">;

export interface ReferenceSchema extends SanitySchemaBase {
  type: "reference";

  /** [Docs](https://www.sanity.io/docs/reference-type#filter-ebd7a95f9dc6) */
  options?: ReferenceOptions;

  /** [Validation docs](https://www.sanity.io/docs/validation) */
  validation?: (rule: ReferenceRule) => Validation<ReferenceRule>;

  /**
   * Required. Must contain an array naming all the types which may be referenced
   * e.g. [{type: 'person'}]. See more examples below.
   *
   * [Docs](https://www.sanity.io/docs/reference-type#to-be04ff05daec)
   */
  to: Readonly<SchemaOptionalName> | Readonly<SchemaOptionalName[]>;
  /**
   * Default false. If set to true the reference will be made weak.
   * This means you can discard the object being referred to without first deleting the reference,
   * thereby leaving a dangling pointer.
   *
   * [Docs](https://www.sanity.io/docs/reference-type#weak-42caf64aeae5)
   */
  weak?: boolean;

  /** [Validation docs](https://www.sanity.io/docs/validation) */
  initialValue: InitialValueProperty<{ _type: string; _ref: string }>;
}

export type ReferenceRule = Rule<ReferenceRule>;

export type ReferenceOptions =
  | {
      /** [Docs](https://www.sanity.io/docs/reference-type#filter-ebd7a95f9dc6) */
      filter: ReferenceFilterResolver;
    }
  | {
      /** [Docs](https://www.sanity.io/docs/reference-type#filter-ebd7a95f9dc6) */
      filter: string;

      /** [Docs](https://www.sanity.io/docs/reference-type#filterParams-0bab0cc1c383) */
      filterParams?: Record<string, unknown>;
    };
