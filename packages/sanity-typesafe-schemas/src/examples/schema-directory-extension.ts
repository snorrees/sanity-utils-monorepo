import { StringSchema } from "../schemas/string";

export type SpecialStringSchema = Omit<StringSchema, "type"> & {
  type: "special-string";
  options: {
    special: string;
  };
};

declare module "../schema-directory" {
  interface SchemaDirectory {
    "special-string": SpecialStringSchema;
  }
}
