import { reject, clone, find, pull } from 'lodash'

const state = {
  filter: []
}

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
  SET_FILTER (state, { key, value }) {
    // console.log('SET_FILTER', key, value)
    const filter = clone(state.filter)
    filter.push({
      'key': key,
      'values': [value],
      'invert': false
    })
    state.filter = filter
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
  setFilter ({ commit }, { key, value }) {
    // console.log('setFilter', key, value)
    commit('RESET_FILTER', key)
    commit('SET_FILTER', { key, value })
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
  }
}

export default {
  state,
  mutations,
  actions
}
