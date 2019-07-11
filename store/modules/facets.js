// Coordinates the visible/selected facets
import { compact, get, map, filter } from 'lodash'

const state = {
  facets: [],
  visibleFacets: []
}

const getters = {
  titles: state => {
    return map(filter(state.facets, 'title'), 'key')
  },
  visibleHeader: state => {
    // Get a list of all keys from the facets
    // This is used for the Table view to build each row
    return map(state.facets, 'key')
  }
}

const mutations = {
  SET_FACETS (state, facets) {
    // Sets the content of the Finder. It is triggered by setContent in the Wrapper component
    state.facets = facets
  },
  SET_VISIBLE_FACETS (state, visibleFacets) {
    state.visibleFacets = visibleFacets
  }
}

const actions = {
  setVisibleFacets ({ commit }, value) {
    commit('SET_VISIBLE_FACETS', value)
  },
  setContent ({ commit }, obj) {
    // Sets the content of the Finder. It is called by the Wrapper component
    const facets = get(obj, 'facets', [])
    const visibleFacets = compact(map(facets, facet => {
      // TODO: Make conditionally
      return facet.key[0]
    }))
    commit('SET_FACETS', facets)
    commit('SET_VISIBLE_FACETS', visibleFacets)
  }
}

export default {
  state,
  getters,
  mutations,
  actions
}
