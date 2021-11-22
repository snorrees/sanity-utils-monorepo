import { MultiFieldSet } from "@sanity/types";

export type Fieldset = Omit<MultiFieldSet, "fields" | "single">;
