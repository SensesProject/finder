import { reject, clone, find, pull, isUndefined, get, forEach, isArray } from 'lodash'

const state = () => ({
  filter: []
})

const mutations = {
  RESET_FILTERS (state) {
    // Resets all filter
    state.filter = []
  },
  RESET_FILTER (state, key) {
    // Reset a single filter
    // console.log('RESET_FILTER', key)
    state.filter = reject(state.filter, ['key', key])
  },
  SET_FILTER (state, { key, value, type }) {
    // console.log('SET_FILTER', key, value)
    if (!isUndefined(type) && !isUndefined(key) && !isUndefined(value)) {
      const filter = clone(state.filter)
      filter.push({
        key,
        'values': isArray(value) ? value : [value],
        'invert': false,
        type
      })
      state.filter = filter
    }
  },
  ADD_FILTER (state, { key, value }) {
    // console.log('SET_FILTER', key, value)
    const filter = clone(state.filter)
    const facet = find(filter, ['key', key])
    facet.values.push(value)
    state.filter = filter
  },
  INVERT_FILTER (state, { key }) {
    // console.log('SET_FILTER', key, value)
    const filter = clone(state.filter)
    const facet = find(filter, ['key', key])
    facet.invert = !facet.invert
    state.filter = filter
  },
  REMOVE_FILTER (state, { key, value }) {
    // console.log('SET_FILTER', key, value)
    const filter = clone(state.filter)
    const facet = find(filter, ['key', key])
    pull(facet.values, value)
    if (facet.values.length === 0) {
      state.filter = reject(state.filter, ['key', key])
    } else {
      state.filter = filter
    }
    // console.log(filter)
  }
}

const actions = {
  resetFilters ({ commit }) {
    commit('RESET_FILTERS')
  },
  resetFilter ({ commit }, key) {
    // console.log('resetFilter')
    commit('RESET_FILTER', key)
  },
  setFilter ({ commit }, { key, value, type }) {
    commit('RESET_FILTER', key)
    commit('SET_FILTER', { key, value, type })
  },
  addFilter ({ commit }, { key, value }) {
    // console.log('addFilter', key, value)
    commit('ADD_FILTER', { key, value })
  },
  removeFilter ({ commit }, { key, value }) {
    // console.log('removeFilter', key, value)
    commit('REMOVE_FILTER', { key, value })
  },
  invertFilter ({ commit }, key) {
    // console.log('invertFilter', key)
    commit('INVERT_FILTER', { key })
  },
  initFilter ({ dispatch, rootState }, query) {
    const types = {
      'Facet': 'key-value',
      'Search': 'term',
      'Histogram': 'range'
    }
    const facets = get(rootState, ['facets', 'facets'], [])
    forEach(query, (value, key) => {
      const facet = find(facets, { id: key })
      const type = get(types, get(facet, 'type'), false)
      const ki = get(facet, 'key')
      dispatch('setFilter', { key: ki, value: value.split('|'), type })
    })
  }
}

export default {
  state,
  mutations,
  actions
}
