# Sanity Utils Monorepo

Monorepo with an assortment of utilities for Sanity. 

## Package overview

### Sanity IFrame Preview
Framework agnostic in-studio live updated previews for Sanity Studio.
* [sanity-plugin-iframe-preview](packages/sanity-plugin-iframe-preview)
* [sanity-iframe-api](packages/sanity-iframe-api)
* [sanity-iframe-api-react](packages/sanity-iframe-api-react)


### Sanity Typesafe Schemas
Helper functions that bring autocomplete and feature discovery to Sanity schemas.
* [sanity-typesafe-schemas](packages/sanity-typesafe-schemas)

## Develop

* `npm install`
* `npm run bootstrap`

Enable prettier and eslint in your IDE.

See more in each individual package.

### Add pacakges

Run `npm run bootstrap` after adding a package.
Use TypeScript references for ts-packages that depend on each other. 

### Get current version

`npm run version:dry-run`

### Publish all changed packages

`npm run publish`

