// This module organises the applied filters
import { map, fromPairs } from 'lodash'

// TODO: Handle inverted facets

const getters = {
  // This creates an object from the active filter
  url: (state, getters, rootState) => {
    return fromPairs(map(rootState.filter.filter, filter => {
      return [filter.id, filter.values.join('|')]
    }))
  },
  // This creates and url string form the active filter
  urlString: (state, getters, rootState) => {
    const link = map(getters.url, (value, key) => {
      return `${key}=${value}`
    }).join('&')
    return `${link ? '?' : ''}${encodeURI(link)}`
  }
}

export default {
  getters
}
