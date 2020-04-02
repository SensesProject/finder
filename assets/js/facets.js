// Function that are used by the facets module
import { fromPairs, map } from 'lodash'

// This function is a custom reducer that counts not only remainig items but also total number of items
export const customReducer = function () {
  // The reducer is called twice for every item. Once items are added and then removed if not fitting to the filter
  // https://github.com/crossfilter/crossfilter/wiki/API-Reference#group_reduce
  // https://github.com/crossfilter/crossfilter/wiki/API-Reference#group_order
  return [
    // ADD: First we count both remaining items and total number
    (p, v) => {
      console.log({ p, v })
      ++p.count
      p.total += v.total
      return p
    },
    // REMOVE: When items are removed, we only subtract the number of remaining items
    (p, v) => {
      --p.count
      p.total -= v.total
      return p
    },
    // INITIAL: First value is remaining. Second is total number
    () => {
      return {count: 0, total: 0}
    }
  ]
}

// This sorts the list of times
// const sortBlob = function (arr) {
//   // Return the negative value of the total count to make it reverse
//   return sortBy(arr, d => -d.value[1])
// }

// This takes the dimension and generate a list of items with counting
export const getList = function (facet) {
  return facet.group() // .reduce(...customReducer())
}

// This sorts the list of times
// const sortByKey = function (arr) {
//   // Return the negative value of the total count to make it reverse
//   return sortBy(arr, d => d.key)
// }

// This takes the dimension and generate a list of items with counting
export const getHistogram = function (facet, n = 10) {
  // TODO: Pass precision
  return facet.group((d) => Math.floor(d / n) * n).reduce(...customReducer())
}

export const makeDict = function (arr) {
  return fromPairs(map(arr, ({ key, value }) => {
    return [key, value]
  }))
}
