// Coordinates the visible/selected facets
import { map, filter } from 'lodash'

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
  SET_CONTENT (state, { facets }) {
    // Sets the content of the Finder. It is triggered by setContent in the Wrapper component
    state.facets = facets
  },
  INIT_VISIBLE_FACETS (state, facets) {
    state.visibleFacets = map(facets, true)
  }
}

const actions = {
  setContent ({ commit }, obj) {
    // Sets the content of the Finder. It is called by the Wrapper component
    commit('SET_CONTENT', obj)
  },
  initVisibleFacets ({ commit }, facets) {
    const visibleFacets = map(facets, true)
    commit('INIT_VISIBLE_FACETS', visibleFacets)
  }
}

export default {
  state,
  getters,
  mutations,
  actions
}
