// Coordinates the visible/selected facets. Facets are the columns of the table that the user can use for filtering
import { compact, get, map, set, forEach, kebabCase } from 'lodash'
import axios from 'axios'
import { isTooOld } from '../../assets/js/utils'

// A list of possible facts is set in the Wrapper component. It is stored with all options in the facts state.
// The visibleFacets state contains only a list of keys that are used
const state = () => ({
  facets: [],
  visibleFacets: [],
  date: null, // Date the data was fetched
  url: null
})

// These keys are the one that should are relevant and should be extracted from the Google Sheet
const KEYS = ['key', 'label', 'group', 'system', 'popover.key', 'popover.path', 'popover.url', 'title', 'tooltip', 'type', 'visible']

function extractFromGoogleTable (data) {
  // This function extracts the relevant data from the Google Sheet response
  return map(get(data, ['feed', 'entry']), entry => {
    const obj = {}
    forEach(KEYS, key => {
      let value = get(entry, [`gsx$${key}`, '$t'])
      // Some reformatting if value is TRUE or FALSE
      switch (value) {
        case 'TRUE':
          value = true
          break
        case 'FALSE':
          value = false
          break
      }
      set(obj, key, value)
    })
    // Generate a id for each facet. This is used to trigger each filter
    set(obj, 'id', kebabCase(get(entry, [`gsx$label`, '$t'])))
    return obj
  })
}

const mutations = {
  SET_FACETS (state, facets) {
    // Sets the available facets
    state.facets = facets
    state.date = new Date()
  },
  SET_VISIBLE_FACETS (state, visibleFacets) {
    // Set the keys of visible facts.
    state.visibleFacets = visibleFacets
  },
  SET_URL_FACETS (state, url) {
    // Sets the url where the facets are stored
    state.url = url
  }
}

const actions = {
  setUrlFacets ({ commit }, url) {
    // This action is used by the popover to change the visble facets
    commit('SET_URL_FACETS', url)
  },
  setFacets ({ commit }, facets) {
    // Sets the columns of the Finder.
    // The init values for visible facets are stored in the facet list
    commit('SET_FACETS', facets)
  },
  setVisibleFacets ({ commit }, value) {
    // This action is used by the popover to change the visble facets
    commit('SET_VISIBLE_FACETS', value)
  },
  setInvisibleFacets ({ state, commit }) {
    // This function is called after facets are loaded
    const visibleFacets = compact(map(state.facets, (facet) => {
      // Only facets that are visible should be listed as filter. Also facets that have the system tags should not be visible. They are used for other things.
      return get(facet, 'visible', false) && !get(facet, 'system', true) ? facet.id : false
    }))
    commit('SET_VISIBLE_FACETS', visibleFacets)
  },
  loadFacets ({ commit, state, dispatch }, isForced = false) {
    // This function loads the facets from the Google Sheet. It is called by the localStorage
    console.log('Action: Check facet data', { isForced })
    // Try to get the time the data was loaded the last time
    const lastLoad = get(state, 'date', null)
    // Compare current date and last loaded data
    const shouldReload = !lastLoad || isTooOld(lastLoad)
    // If data should reload or is forced, set to true
    const willReload = shouldReload ? true : isForced
    // Try to get the url. This is set as Finder prop.
    const url = get(state, 'url', null)
    // If should reload and url is found
    if (willReload && url) {
      console.log('Facets data is too old or reload is forced. Will reload data')
      axios.get(url)
        .then((response) => {
          // Extract the data from the Google Table structure
          dispatch('setFacets', extractFromGoogleTable(response.data))
          // Set the visible facets
          dispatch('setInvisibleFacets')
          // Initiate the filter. This action is in the filter module
          dispatch('initFilter')
        })
        .catch((error) => {
          console.error('error', error)
        })
    } else { // If url false or loading not necessary or forced
      // Set the visible facets
      dispatch('setInvisibleFacets')
      // Initiate the filter. This action is in the filter module
      dispatch('initFilter')
    }
  }
}

export default {
  state,
  mutations,
  actions
}
