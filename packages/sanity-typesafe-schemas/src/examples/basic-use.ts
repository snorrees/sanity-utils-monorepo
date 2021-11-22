import { arrayOf, field, schema } from "../typesafe-schemas";

export const testDocumentSchema = schema("document", {
  name: "test",
  title: "Test document",
  fields: [
    field("special-string", {
      name: "special",
      title: "Special text",
      options: {
        special: "wicked",
      },
    }),
    field("array", {
      name: "someArray",
      title: "Some strings",
      of: [arrayOf("string", {})],
    }),
  ],
  options: {
    custom: true,
  },
});
