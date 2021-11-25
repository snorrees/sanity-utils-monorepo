import { HideFunction } from "./common";

export interface FieldBase {
  fieldset?: string;

  /** https://www.sanity.io/docs/schema-types#hidden-57ac9e4a350a and https://www.sanity.io/docs/conditional-fields*/
  hidden?: boolean | HideFunction;

  /** https://www.sanity.io/docs/schema-types#readOnly-da6ffd43feed */
  readOnly?: boolean;

  /**
   * In the creation of a field in a document, you can specify an initialValue for that specific instance of the field.
   *
   * {@link https://www.sanity.io/docs/initial-value-templates#f21ca49a29ae Initial value templates docs }
   */
  initialValue?: unknown;
}
