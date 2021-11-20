# Sanity Plugin: IFrame Preview - Alpha release

THIS IS A PROOF OF CONCEPT, CONSIDER IT AS WORK IN PROGRESS.

Sanity Iframe Preview component.

Implements an iframe.postMessage protocol  that allows the target iframe to specify
a GROQ-query for the studio to execute.
The result of the query will be sent to the iframe whenever the query
revision matches the studio revision.


Should be used in unison with sanity-iframe-api-alpha.

## TODOS
* Generic type param for document
* Tests
* Better error messages & error handling 
* jsdocs
* Better docs

## Install
Install as a dependency in your Sanity Studio:

`npm install sanity-plugin-iframe-preview-alpha`

## Usage
Use in your structure code:
```ts
import { IFramePreview } from 'sanity-plugin-iframe-preview-alpha'

S.view
  .component(IFramePreview)
  .options({
      url: () => 'iframe-url' // () => (string | Promise<string>)
   })   
  .icon(EyeIcon)
  .id("preview")
  .title("Preview")
```

### Define preview component from schema
To enable iframe preview directly schema definition, do something along the lines of the following example:
```ts
// someSchema.tsx
export const someSchema = {
    type: 'document',
    title: 'Some doc',
    previewComponent: IFramePreview
    fields: [/** omitted */]
}

// given sanity.json with structure implemented like so
{
  "name": "part:@sanity/desk-tool/structure",
  "path": "./structure.ts"
}

// structure.ts
export function editAndPreviewViews<T>(previewComponent: IPreviewComponent<T>) {
  return [
    S.view.form().title("Edit").icon(EditIcon),
    S.view
      .component(previewComponent)
      .icon(EyeIcon)
      .id("preview")
      .title("Preview"),
  ];
}

// https://www.sanity.io/docs/structure-builder-reference#97e44ce262c9
export const getDefaultDocumentNode = ({ schemaType }: any) => {
  const matchingTypes = S.documentTypeListItems()
    .filter((listItem: any) => listItem.spec.schemaType.name === schemaType)
    .map((listItem: any) => {
      const previewComponent = listItem.spec.schemaType.previewComponent;
      if (previewComponent) {
        return S.document().views(editAndPreviewViews(previewComponent));
      }
      return S.document();
    });
  return matchingTypes.length ? matchingTypes[0] : S.document();
};

export default () => S.list().items(/* your structure */)
```

*Caveat*: uses access to protected `listItem.spec` feield; this might break in future Sanity releases.

## Types
`sanipack` seems to be kinda particular about not building types. 
Therefore, type are build separately and placed in `/lib/types`.


## Develop

### Build
`npm run build`

### Test
```bash
cd /path/to/my-studio
npm link sanity-plugin-iframe-preview-alpha
```

