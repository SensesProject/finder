// Coordinates the visible/selected facets. Facets are the columns of the table that the user can use for filtering
import { compact, get, map, set, forEach, kebabCase } from 'lodash'
import axios from 'axios'

// A list of possible facts it set in the Wrapper component. It is stored with all options in the facts state.
// The visibleFacets state contains only a list of keys that are used
const state = () => ({
  facets: [],
  visibleFacets: [],
  date: null, // Date the data was fetched
  url: null
})

const KEYS = ['key', 'label', 'popover.key', 'popover.path', 'popover.url', 'title', 'tooltip', 'type', 'visible']

function extractFromGoogleTable (data) {
  return map(get(data, ['feed', 'entry']), entry => {
    const obj = {}
    forEach(KEYS, key => {
      let value = get(entry, [`gsx$${key}`, '$t'])
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
    set(obj, 'id', kebabCase(get(entry, [`gsx$label`, '$t'])))
    return obj
  })
}

const mutations = {
  SET_FACETS (state, facets) {
    // Sets the content of the Finder. It is triggered by setFacets in the Wrapper component
    console.log('old date', state.date)
    state.facets = facets
    state.date = new Date()
    console.log('new date', state.date)
  },
  SET_VISIBLE_FACETS (state, visibleFacets) {
    // Set the keys of visible facts. It is triggered by setFacets in the Wrapper component
    state.visibleFacets = visibleFacets
  },
  SET_URL_FACETS (state, url) {
    state.url = url
  }
}

const actions = {
  setUrlFacets ({ commit }, url) {
    // This action is used by the popover to change the visble facets
    commit('SET_URL_FACETS', url)
  },
  setVisibleFacets ({ commit }, value) {
    // This action is used by the popover to change the visble facets
    commit('SET_VISIBLE_FACETS', value)
  },
  setFacets ({ commit }, facets) {
    // Sets the columns of the Finder. It is called by the Wrapper component
    // The init values for visible facets are stored in the facet list
    commit('SET_FACETS', facets)
  },
  setInvisibleFacets ({ state, commit }) {
    const visibleFacets = compact(map(state.facets, facet => {
      return get(facet, 'visible', false) ? facet.id : false
    }))
    commit('SET_VISIBLE_FACETS', visibleFacets)
  },
  loadFacets ({ commit, state, dispatch }, isForced = false) {
    console.log('Action: Check facet data', { isForced })
    const ONE_DAY = 60 * 60 * 1000 * 24
    const lastLoad = get(state, 'date', null)
    const shouldReload = !lastLoad || ((new Date()) - new Date(lastLoad)) > ONE_DAY
    const willReload = shouldReload ? true : isForced
    const url = get(state, 'null', null)
    if (willReload && url) {
      console.log('Facets data is too old or reload is forced. Will reload data')
      axios.get(url)
        .then((response) => {
          dispatch('setFacets', extractFromGoogleTable(response.data))
          dispatch('initFilter')
        })
        .catch((error) => {
          console.error('error', error)
        })
    } else {
      dispatch('setInvisibleFacets')
      dispatch('initFilter')
    }
  }
}

export default {
  state,
  mutations,
  actions
}
