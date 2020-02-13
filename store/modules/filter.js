import { reject, clone, find, pull, isUndefined, get, forEach, isArray, set, map, fromPairs } from 'lodash'

const state = () => ({
  filter: [],
  initFilter: null
})

const getters = {
  url: (state, getters, rootState) => {
    return fromPairs(map(state.filter, filter => {
      return [filter.id, filter.values.join('|')]
    }))
  }
}

const mutations = {
  RESET_FILTERS (state) {
    // Resets all filter
    set(state, 'filter', [])
  },
  RESET_FILTER (state, id) {
    // Reset a single filter
    // console.log('RESET_FILTER', id)
    state.filter = reject(state.filter, ['id', id])
  },
  SET_FILTER (state, { id, value, type, key }) {
    // This initiates a filter for one column/key
    // The column is filtered by items in values
    if (!isUndefined(type) && !isUndefined(id) && !isUndefined(value) && !isUndefined(key)) {
      const filter = clone(state.filter)
      filter.push({
        id,
        'values': isArray(value) ? value : [value],
        'invert': false,
        type,
        key
      })
      state.filter = filter
    }
  },
  ADD_FILTER (state, { id, value }) {
    // This adds a value to an existing filter
    const filter = clone(state.filter)
    const facet = find(filter, ['id', id])
    facet.values.push(value)
    state.filter = filter
  },
  INVERT_FILTER (state, { id }) {
    const filter = clone(state.filter)
    const facet = find(filter, ['id', id])
    facet.invert = !facet.invert
    state.filter = filter
  },
  REMOVE_FILTER (state, { id, value }) {
    const filter = clone(state.filter)
    const facet = find(filter, ['id', id])
    pull(facet.values, value)
    if (facet.values.length === 0) {
      state.filter = reject(state.filter, ['id', id])
    } else {
      state.filter = filter
    }
  },
  SET_INIT_FILTER (state, initFilter) {
    set(state, 'initFilter', initFilter)
  }
}

const TYPES = {
  'Facet': 'key-value',
  'Search': 'term',
  'Histogram': 'range'
}

const actions = {
  resetFilters ({ commit }) {
    commit('RESET_FILTERS')
  },
  resetFilter ({ commit }, id) {
    // console.log('resetFilter')
    commit('RESET_FILTER', id)
  },
  setFilter ({ commit, rootState }, { id, value }) {
    const facets = get(rootState, ['facets', 'facets'])
    const facet = find(facets, { id })
    const type = get(TYPES, get(facet, 'type')) // The type of the filter (range, key-value, term)
    const key = get(facet, 'key') // The »address« of the value
    if (!isUndefined(type) && !isUndefined(id) && !isUndefined(value) && !isUndefined(key)) {
      commit('RESET_FILTER', id)
      commit('SET_FILTER', { id, value, type, key })
    }
  },
  addFilter ({ commit }, { id, value }) {
    // console.log('addFilter', id, value)
    commit('ADD_FILTER', { id, value })
  },
  removeFilter ({ commit }, { id, value }) {
    // console.log('removeFilter', id, value)
    commit('REMOVE_FILTER', { id, value })
  },
  invertFilter ({ commit }, id) {
    // console.log('invertFilter', id)
    commit('INVERT_FILTER', { id })
  },
  setInitFilter ({ commit }, initFilter) {
    commit('SET_INIT_FILTER', initFilter)
  },
  initFilter ({ dispatch, commit }) {
    forEach(state.initFilter, (value, id) => {
      dispatch('setFilter', { id, value: value.split('|') })
    })
    commit('SET_INIT_FILTER', null)
  }
}

export default {
  state,
  getters,
  mutations,
  actions
}
