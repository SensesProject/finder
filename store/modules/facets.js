// Coordinates the visible/selected facets. Facets are the columns of the table that the user can use for filtering
import { compact, get, map } from 'lodash'

// A list of possible facts it set in the Wrapper component. It is stored with all options in the facts state.
// The visibleFacets state contains only a list of keys that are used
const state = () => ({
  facets: [],
  visibleFacets: []
})

const mutations = {
  SET_FACETS (state, facets) {
    // Sets the content of the Finder. It is triggered by setFacets in the Wrapper component
    state.facets = facets
  },
  SET_VISIBLE_FACETS (state, visibleFacets) {
    // Set the keys of visible facts. It is triggered by setFacets in the Wrapper component
    state.visibleFacets = visibleFacets
  }
}

const actions = {
  setVisibleFacets ({ commit }, value) {
    // This action is used by the popover to change the visble facets
    commit('SET_VISIBLE_FACETS', value)
  },
  setFacets ({ commit }, facets) {
    // Sets the columns of the Finder. It is called by the Wrapper component
    // The init values for visible facets are stored in the facet list
    const visibleFacets = compact(map(facets, facet => {
      return get(facet, 'visible', false) ? facet.id : false
    }))
    commit('SET_FACETS', facets)
    commit('SET_VISIBLE_FACETS', visibleFacets)
  }
}

export default {
  state,
  mutations,
  actions
}
