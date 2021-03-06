import { Preview, SanitySchemaBase } from "./util-types/common";
import { Rule, Validation } from "./util-types/validation";
import { InitialValueProperty } from "@sanity/types";
import { Fieldset } from "./util-types/fieldset";

interface Ordering {
  title: string;
  name: string;
  by: { field: string; direction: "asc" | "desc" }[];
}
/**
 * [Document type]{@link https://www.sanity.io/docs/document-type }.
 */
export interface DocumentSchema extends SanitySchemaBase {
  type: "document";

  /** [Validation docs](https://www.sanity.io/docs/validation) */
  validation?: (rule: DocumentRule) => Validation<DocumentRule>;

  /** [Initial value docs](https://www.sanity.io/docs/initial-value-templates) */
  initialValue?: InitialValueProperty;

  /** [Preview docs](https://www.sanity.io/docs/previews-list-views) */
  preview?: Preview;

  /**  [Fieldsets docs](https://www.sanity.io/docs/object-type#AbjN0ykp). */
  fieldsets?: Fieldset[];

  /** [Sort order docs]{@ link https://www.sanity.io/docs/sort-orders } */
  orderings?: Ordering[];

  /** [Docs](https://www.sanity.io/docs/document-type#liveEdit-6752c1c910a8) */
  liveEdit?: boolean;

  fields: unknown[];
}

/**
 * [Document validation]{@link https://www.sanity.io/docs/validation#document-level-validation-053289e55848 }.
 */
export type DocumentRule = Rule<DocumentRule>;
