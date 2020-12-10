// Coordinates the visible/selected facets. Facets are the columns of the table that the user can use for filtering
import { get, map, forEach, fromPairs, filter } from 'lodash'
import axios from 'axios'
import { isTooOld, extractFromGoogleTable } from '../../assets/js/utils'
import { format } from 'timeago.js'
import { KEY_UNIQ_ID, FACET_KEYS, KEY_PATH, KEY_HAS_ACTIVE_FILTERS, KEY_DIMENSION, KEY_FILTER, KEY_DATE, KEY_URL, KEY_FACETS_FACETS, KEY_FACETS_VISIBLE, KEY_FACETS_ALL, KEY_FILTER_VALID, KEY_FILTER_TYPE_DETAILS, DEFAULT_REGION, DEFAULT_YEAR } from '../config'

// A list of possible facts is set in the Wrapper component. It is stored with all options in the facts state.
// The visibleFacets state contains only a list of keys that are used
const state = () => ({
  // These are all facet options as they are coming from the Google Sheet
  [KEY_FACETS_ALL]: [],
  // // These are the facets that are currently visible
  // [KEY_FACETS_VISIBLE]: [],
  // This holds the actually facet information (counting, dimension, …)
  [KEY_FACETS_FACETS]: {},
  // Date the data was fetched
  [KEY_DATE]: null,
  // Url where the information of the facets is stored
  [KEY_URL]: null,
  [KEY_HAS_ACTIVE_FILTERS]: false
})

const mutations = {
  FILTER (state, filter) {
    // console.log('facets/FILTER')
    // console.log({filter})
    let hasActiveFilters = false // This is used for the reset button
    const lists = fromPairs(map(filter, ({ facet, [KEY_DIMENSION]: dimension, [KEY_UNIQ_ID]: uniqID }) => {
      // As we loop over each filter, we check if they have any filters
      // console.log('facets/FILTER:', uniqID, facet.all())
      if (dimension.hasCurrentFilter()) {
        hasActiveFilters = true
      }
      return [uniqID, facet.all()]
    }))
    // console.log({ lists })
    state[KEY_FACETS_FACETS] = lists
    state[KEY_HAS_ACTIVE_FILTERS] = hasActiveFilters
    // console.log('finished')
  },
  SET_FACETS (state, facets) {
    // console.log('SET_FACETS', facets.length)
    // Recieves the list of keys from the Google Sheet
    state[KEY_FACETS_ALL] = facets
    // Saves the current date
    state[KEY_DATE] = new Date()
  },
  // SET_VISIBLE_FACETS (state, visibleFacets) {
  //   // Set the keys of visible facts.
  //   state[KEY_FACETS_VISIBLE] = visibleFacets
  // },
  SET_URL_FACETS (state, url) {
    // Sets the url where the facets are stored
    state[KEY_URL] = url
  }
}

const actions = {
  filter ({ commit, rootState }) {
    // console.log('facets/Filter')
    // This function calls the filter mutation with the list of filter currently active
    // This function is called every time a filter is applied
    // console.log('filter', get(rootState, ['filter', KEY_FILTER], []))
    commit('FILTER', get(rootState, ['filter', KEY_FILTER], []))
  },
  setUrlFacets ({ commit }, url) {
    // console.log('facets/setUrlFacets')
    // This action is used by the popover to change the visble facets
    commit('SET_URL_FACETS', url)
  },
  setFacets ({ commit }, facets) {
    // console.log('facets/setFacets')
    // This function organises the facets before saving them

    // Filter out valid facet types
    const validFacets = filter(facets, ({ type }) => KEY_FILTER_VALID.includes(type))

    const definedFacets = map(validFacets, (facet) => {
      if (facet.type !== KEY_FILTER_TYPE_DETAILS) {
        return facet
      } else {
        // This is only necessary for facet of the type "details"
        // We add the default region and year to the facet as »starting« selection
        return {
          ...facet,
          region: DEFAULT_REGION,
          year: DEFAULT_YEAR
        }
      }
    })
    // console.log('setting ', definedFacets.length, 'facets')
    // console.log({ validFacets })
    // Sets the columns of the Finder.
    // The init values for visible facets are stored in the facet list
    commit('SET_FACETS', definedFacets)
  },
  // setVisibleFacets ({ commit }, value) {
  //   // console.log('facets/setVisibleFacets')
  //   // This action is used by the popover to change the visble facets
  //   commit('SET_VISIBLE_FACETS', value)
  // },
  setVisibleFacets ({ state, commit, dispatch }) {
    // console.log('facets/setVisibleFacets')
    // For every visible facet, we initiate a filter
    // console.log(state[KEY_FACETS_ALL].length)
    forEach(state[KEY_FACETS_ALL], (facet) => {
      if (get(facet, 'visible', false) && !get(facet, 'system', true)) {
        // console.log('visible', facet.label)
        dispatch('filter/addFacet', facet, { root: true })
      }
    })
    // Set the list of visible filter for the popover
    // commit('SET_VISIBLE_FACETS', visibleFacets)
  },
  loadFacets ({ commit, state, dispatch }, isForced = false) {
    // console.log('facets/loadFacets')
    // This function loads the facets from the Google Sheet. It is called by the localStorage
    // console.log('Action: Check facet data', { isForced })
    // Try to get the time the data was loaded the last time
    const lastLoad = get(state, KEY_DATE, null)
    // Compare current date and last loaded data
    const shouldReload = isTooOld(lastLoad)
    // If data should reload or is forced, set to true
    const willReload = shouldReload ? true : isForced
    // Try to get the url for fetching the facets. This is set as Finder prop.
    const url = get(state, KEY_URL, null)
    // If should reload and url is found
    if (willReload && url) {
      // console.log('Facets data is too old or reload is forced. Will reload data')
      axios.get(url)
        .then((response) => {
          // console.log('removing filters')
          dispatch('filter/removeFilters', false, { root: true })
          // Extract the data from the Google Table structure
          dispatch('setFacets', extractFromGoogleTable(FACET_KEYS, response.data))
          // Set the visible facets
          dispatch('setVisibleFacets')
          // Initiate the filter. This action is in the filter module
          dispatch('filter/initFilter', false, { root: true })
        })
        .catch((error) => {
          console.error('error', error)
        })
    } else { // If url is false or loading not necessary or forced
      if (!shouldReload) {
        console.log('Already loaded facets', format(get(state, KEY_DATE, null)))
      }
      if (!url) {
        console.log('URL for recieving facets not found')
      }
      // console.log('Using facets from localStorage')
      // Set the visible facets
      dispatch('setVisibleFacets')
      // Initiate the filter. This action is in the filter module
      dispatch('filter/initFilter', false, { root: true })
    }
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
