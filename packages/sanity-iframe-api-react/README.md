# sanity-iframe-api-react

WORK IN PROGRESS.

## Installation

`npm i @snorreeb/sanity-iframe-api-react`

## Usage

In your React-component:

```tsx
import { usePreviewData } from '@snorreeb/sanity-iframe-api-react'

function MyPage({ prefetchedData }) {
    const data = usePreviewData({
        sanityClientVersion: "2021-06-01",
        // groq MUST contain _rev projected at the top level
        groqQuery: "* [_type='my-page' && _id == $id]{_rev, ...}[0]",
        queryParams: (doc) => ({id: doc._id}), // default
        initialData: prefetchedData,
        enabled: () => /* when url contains query param sanityPreview=true */ // default
    });
    
    return <div>{data.title}</div>
}

// When this component is loaded in an iframe, embedded in IFramePreview in Sanity Studio,
// it will receive updated data whenever the Studio makes edits.
```

See jsdocs for each config-parameter for details.

### Lazy-loaded query
The hook will only load the relevant preview when the enabled prop resolves to true.
To avoid putting your GROQ-query in the main bundle, you might want to lazy load it:

```tsx
function MyPage() {
    const data = usePreviewData({
        groqQuery: () => import("./my-groq-query").then((module) => module.myGroqQuery),
        enabled: () => whenCondtionPermits
    });
    return <div>{data.title}</div>
}
```

## Development

### Testing in next.js / React app

React-hooks are very particular about React-version, and do not seem to work
well with `npm link`. The most bulletproof way of testing this package is therefore:

* `cd to/this/package`
* `npm pack`
* `cp <package-tar file> /path/to/nextjs/node_modules`
* `cd /path/to/nextjs`
* `npm install ./node_modules/<package-tar file>`
* Revert package.json when done testing.

