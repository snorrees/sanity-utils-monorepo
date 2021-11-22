import { Path } from "@sanity/types/src/paths/index";
import {
  SlugifierFn,
  SlugSourceFn,
  UniqueCheckerFn,
} from "@sanity/types/src/slug/types";
import { SanitySchemaBase } from "./util-types/common";
import { Rule, Validation } from "./util-types/validation";
import { InitialValueProperty } from "@sanity/types/src/schema/types";

export type SlugOptions = {
  /**
   * The name of the field which the slug value is derived from.
   * You can supply a function, instead of a string.
   *
   * If so, the source function is called with two parameters:
   * doc (object - the current document) and options
   * (object - with parent and parentPath keys for easy access to sibling fields).
   *
   * [Docs](https://www.sanity.io/docs/slug-type#source-9a89f442eaea)
   */
  source?: string | Path | SlugSourceFn;

  /**
   * Maximum number of characters the slug may contain when generating it from a source
   * (like a title field) with the default slugify function.
   *
   * Defaults to 200.
   *
   * If you include your own slugify function, or manually enter your slug this option will be ignored.
   *
   * [Docs](https://www.sanity.io/docs/slug-type#maxLength-b3d49bbd365e)
   */
  maxLength?: number;

  /**
   * Supply a custom override function which handles string normalization.
   *
   * slugify is called with two parameters:
   * input (string) and type (object - schema type).
   *
   * If slugify is set, the maxLength option is ignored.
   *
   * [Docs](https://www.sanity.io/docs/slug-type#slugify-b29003e24664)
   */
  slugify?: SlugifierFn;

  /**
   * Supply a custom function which checks whether or not the slug is unique.
   *
   * Receives the proposed slug as the first argument and an options object.
   *
   * [Docs](https://www.sanity.io/docs/slug-type#isUnique-3dd89e75a768)
   */
  isUnique?: UniqueCheckerFn;
};

/** [Slug docs](https://www.sanity.io/docs/slug-type) */
export interface SlugSchema extends SanitySchemaBase {
  type: "slug";
  options?: SlugOptions;

  /** [Validation docs](https://www.sanity.io/docs/validation) */
  validation?: (rule: SlugRule) => Validation<SlugRule>;

  /** [Initial value docs](https://www.sanity.io/docs/initial-value-templates) */
  initialValue?: InitialValueProperty<{ _type: "slug"; current?: string }>;
}

export type SlugRule = Rule<SlugRule>;
