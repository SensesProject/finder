// Coordinates the visible/selected facets. Facets are the columns of the table that the user can use for filtering
import { compact, get, map, kebabCase } from 'lodash'

// A list of possible facts it set in the Wrapper component. It is stored with all options in the facts state.
// The visibleFacets state contains only a list of keys that state if the facet is used or not
const state = () => ({
  facets: [],
  visibleFacets: []
})

const getters = {
  visibleHeader: state => {
    // Get a list of all keys from the facets
    // This is used for the Table view to build each row
    return map(state.facets, 'key')
  }
}

const mutations = {
  SET_FACETS (state, facets) {
    // Sets the content of the Finder. It is triggered by setFacets in the Wrapper component
    state.facets = map(facets, facet => {
      return {
        ...facet,
        id: kebabCase(get(facet, 'label')) // Used for the url
      }
    })
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
    const visibleFacets = compact(map(facets, facet => {
      return get(facet, 'visible', false) ? facet.key : false
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
