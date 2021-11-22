import { field, schema } from "../typesafe-schemas";

export const customStringType = schema("string", {
  name: "string-list",
  title: "String list",
  options: {
    list: [
      { title: "Title A", value: "a" },
      { title: "Title B", value: "b" },
    ],
  },
});

export const schemaReusingNamedType = schema("document", {
  name: "test",
  title: "Test document",
  fields: [
    field("custom", {
      // must provide type explicitly here, when type is "custom" in the helper
      type: customStringType.name,
      name: "customString",
      title: customStringType.title,
    }),
  ],
});
