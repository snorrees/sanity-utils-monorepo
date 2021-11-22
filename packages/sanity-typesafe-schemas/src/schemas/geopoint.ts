import { Rule, Validation } from "./util-types/validation";
import { SanitySchemaBase } from "./util-types/common";

/**
 * [Geopoint docs](https://www.sanity.io/docs/geopoint-type):
 */
export interface GeopointSchema extends SanitySchemaBase {
  type: "geopoint";

  /** [Validation docs](https://www.sanity.io/docs/validation) */
  validation?: (rule: GeopointRule) => Validation<GeopointRule>;
}

export type GeopointRule = Rule<GeopointRule>;
