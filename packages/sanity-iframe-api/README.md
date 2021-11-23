# sanity-iframe-api

WORK IN PROGRESS.

Framework agnostic functions for interacting with
the IFramePreview provided by
`@snorreeb/sanity-plugin-iframe-preview`.


# Installation

`npm i @snorreeb/sanity-iframe-api`

# Usage

```ts
import { initPreview } from '@snorreeb/sanity-iframe-api'

// Somewhere after page load
initPreview(
    {
        sanityClientVersion: "2021-06-01",
        // groq MUST contain _rev projected at the top level
        groqQuery: "* [_type='my-page' && _id == $id]{_rev, ...}[0]",
        queryParams: (doc) => ({id: doc._id}), // default
        initialData: prefetchedData
    },
    (data) => {
        // When this page is loaded in an iframe, 
        // embedded in IFramePreview in Sanity Studio,
        // this callback will receive updated data whenever the Studio makes edits.
        
        // Use it to update your page in whatever way makes sense.
    }
)
```

See jsdocs for each config-param for details.
