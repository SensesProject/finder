# Scenario Finder

## Structure
1. Pages use `components/Finder` as a starting point. They pass urls, titles, … to the Finder.
2. The Finder safes these information on `created`.
3. The loading of data for facets and data is started by the localStorage.

## Build Setup

``` bash
# install dependencies
$ npm install # Or yarn install

# serve with hot reload at localhost:3000
$ npm run dev

# build for production and launch server
$ npm run build
$ npm start

# generate static project
$ npm run generate
```
