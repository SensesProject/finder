// This module organises the applied filters
import { map, fromPairs } from 'lodash'

const getters = {
  url: (state, getters, rootState) => {
    return fromPairs(map(rootState.filter.filter, filter => {
      return [filter.id, filter.values.join('|')]
    }))
  },
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
