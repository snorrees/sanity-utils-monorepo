import { DocumentSchema } from "./schemas/document";
import { StringSchema } from "./schemas/string";
import { Preview, SanitySchemaBase } from "./schemas/util-types/common";
import { FieldBase } from "./schemas/util-types/field";
import { ArraySchema } from "./schemas/array";
import { BlockSchema } from "./schemas/block";
import { BooleanSchema } from "./schemas/boolean";
import { DateSchema } from "./schemas/date";
import { DatetimeSchema } from "./schemas/datetime";
import { FileSchema } from "./schemas/file";
import { GeopointSchema } from "./schemas/geopoint";
import { ImageSchema } from "./schemas/image";
import { NumberSchema } from "./schemas/number";
import { ObjectSchema } from "./schemas/object";
import { ReferenceSchema } from "./schemas/reference";
import { SlugSchema } from "./schemas/slug";
import { TextSchema } from "./schemas/text";
import { UrlSchema } from "./schemas/url";

type SanitySchemaDirectory = {
  array: ArraySchema;
  block: BlockSchema;
  boolean: BooleanSchema;
  date: DateSchema;
  datetime: DatetimeSchema;
  document: DocumentSchema;
  file: FileSchema;
  geopoint: GeopointSchema;
  image: ImageSchema;
  number: NumberSchema;
  object: ObjectSchema;
  reference: ReferenceSchema;
  slug: SlugSchema;
  string: StringSchema;
  text: TextSchema;
  url: UrlSchema;
};

/** Open for extension via declaration merging. */
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface SchemaDirectory extends SanitySchemaDirectory {}

type SchemaDirectoryType = SchemaDirectory[keyof SchemaDirectory]["type"];

/**
 * This is a "fallback" type.
 * Must be used when we want to refers to a type existing in the codebase (derived from sanity types),
 * but that is not listed in {@link SchemaDirectory}
 */
type CustomSchema<T extends string> = {
  type: T;
  options?: unknown;
  validation?: (Rule: unknown) => unknown;
  preview?: Preview;
} & SanitySchemaBase;

/** When type is custom, the type-field must be provided in schema/field/arrayOf schemas. */
type CustomType = "custom";

export type MaybeCustomType = SchemaDirectoryType | CustomType;

export type MaybeCustomSchema<SchemaName extends MaybeCustomType> =
  SchemaName extends SchemaDirectoryType
    ? SchemaDirectory[SchemaName]
    : CustomSchema<SchemaName>;

export type CustomTypeField<T> = T extends CustomType ? string : never;

export type MaybeCustomField<FieldTypeName extends MaybeCustomType> =
  FieldTypeName extends SchemaDirectoryType
    ? SchemaDirectory[FieldTypeName]
    : CustomSchema<FieldTypeName>;

export type GenericField = CustomSchema<string> & FieldBase;
