import _ from 'lodash'

const state = {
  filter: []
}

const mutations = {
  RESET_FACET (state, key) {
    // console.log('RESET_FACET', key)
    state.filter = _.reject(state.filter, ['key', key])
  },
  SET_FACET (state, { key, value }) {
    // console.log('SET_FACET', key, value)
    const filter = _.clone(state.filter)
    filter.push({
      'key': key,
      'values': [value],
      'invert': false
    })
    state.filter = filter
  },
  ADD_FACET (state, { key, value }) {
    // console.log('SET_FACET', key, value)
    const filter = _.clone(state.filter)
    const facet = _.find(filter, ['key', key])
    facet.values.push(value)
    state.filter = filter
  },
  INVERT_FACET (state, { key }) {
    // console.log('SET_FACET', key, value)
    const filter = _.clone(state.filter)
    const facet = _.find(filter, ['key', key])
    facet.invert = !facet.invert
    state.filter = filter
  },
  REMOVE_FACET (state, { key, value }) {
    // console.log('SET_FACET', key, value)
    const filter = _.clone(state.filter)
    const facet = _.find(filter, ['key', key])
    _.pull(facet.values, value)
    if (facet.values.length === 0) {
      state.filter = _.reject(state.filter, ['key', key])
    } else {
      state.filter = filter
    }
    // console.log(filter)
  }
}

const actions = {
  resetFacet ({ commit }, key) {
    // console.log('resetFacet')
    commit('RESET_FACET', key)
  },
  setFacet ({ commit }, { key, value }) {
    // console.log('setFacet', key, value)
    commit('RESET_FACET', key)
    commit('SET_FACET', { key, value })
  },
  addFacet ({ commit }, { key, value }) {
    // console.log('addFacet', key, value)
    commit('ADD_FACET', { key, value })
  },
  removeFacet ({ commit }, { key, value }) {
    // console.log('removeFacet', key, value)
    commit('REMOVE_FACET', { key, value })
  },
  invertFacet ({ commit }, key) {
    // console.log('invertFacet', key)
    commit('INVERT_FACET', { key })
  }
}

export default {
  state,
  mutations,
  actions
}
