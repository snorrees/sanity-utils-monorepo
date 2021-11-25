import { Preview } from "./schemas/util-types/common";
import { FieldBase } from "./schemas/util-types/field";
import {
  CustomTypeField,
  MaybeCustomField,
  MaybeCustomSchema,
  MaybeCustomType,
} from "./schema-directory";

/**
 * Used to define schemas that are consumed by `createSchema` in `part:@sanity/base/schema-creator`
 *
 * See docs for how to extend autocompletion beyond Sanity built-in types.
 * @param type Sanity schema type name. Use 'custom' to refer to a user-made type by name.
 * @param schema Schema definition. Type field is optional, unless 'custom' type is used.
 */
export function schema<
  SchemaName extends string,
  SchemaType extends MaybeCustomType,
  Schema extends MaybeCustomSchema<SchemaType>
>(
  type: SchemaType,
  schema: Omit<Schema, "type"> & {
    name: SchemaName;
    /** Omitting title results in console warnings during schema validation, so make it required. */
    title: string;
    preview?: Preview;
  } & (SchemaType extends CustomTypeField<SchemaType>
      ? { type: string }
      : { type?: SchemaType })
) {
  return {
    type,
    ...schema,
  };
}

/**
 * Used to define fields for `document`, `object`, `file` and `image` schemas.
 *
 * See docs for how to extend autocompletion beyond Sanity built-in types.
 * @param type Sanity schema type name. Use 'custom' to refer to a user-made type by name.
 * @param schema Schema definition. Type field is optional, unless 'custom' type is used.
 */
export function field<
  FieldType extends MaybeCustomType,
  FieldSchema extends MaybeCustomField<FieldType>
>(
  type: FieldType,
  schema: Omit<FieldSchema, "type"> &
    FieldBase & {
      title: string;
    } & (FieldType extends CustomTypeField<FieldType>
      ? { type: string }
      : { type?: FieldType })
) {
  return { type, ...schema };
}

/**
 * Used to define of-entries in `array` schemas.
 *
 * See docs for how to extend autocompletion beyond Sanity built-in types.
 *
 * @param type Sanity schema type name. Use 'custom' to refer to a user-made type by name.
 * @param schema Optional array-of spec. Type field is optional, unless 'custom' type is used.
 */
export function arrayOf<
  ArrayType extends MaybeCustomType,
  ArraySchema extends MaybeCustomField<ArrayType>
>(
  type: ArrayType,
  schema?: Omit<ArraySchema, "type" | "name"> &
    (ArrayType extends CustomTypeField<ArrayType>
      ? { type: string }
      : { type?: ArrayType })
) {
  return {
    type,
    ...schema,
  };
}

/**
 * @see checkSchema for intended usage
 */
export function forType<SchemaInterface>() {
  return {} as SchemaInterface;
}

/**
 * Passthrough function to provide inline types in json objects.
 *
 * @example
 * typed<MyType>({ must be MyType or error })
 *
 * @param arg
 */
export function typed<T>(arg: T) {
  return arg;
}
