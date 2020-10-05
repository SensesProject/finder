import createPersistedState from 'vuex-persistedstate'
import { KEY_DATE, KEY_FACETS_ALL } from '~/store/config'

export default ({ store }) => {
  window.onNuxtReady(() => {
    const { dispatch, state } = store
    createPersistedState({
      // This id must be unique for each Finder instance on the same url
      key: state.id.id,
      // These are the paths of the data that is stored in the localStorage
      paths: [
        'load.data', // The data
        'auth.token', // The authentication key
        'load.status', // The loading status
        `load.${KEY_DATE}`, // Date when the data was loaded last
        `auth.${KEY_DATE}`, // Date when the authentication happened last
        `facets.${KEY_FACETS_ALL}`, // The facets
        `facets.${KEY_DATE}` // Date when the facets were loaded last
      ]
    })(store)
    // Load the facets (from the Google Sheet)
    dispatch('facets/loadFacets', false, { root: true }) // facets/loadFacets
    // Also load the data in parallel
    dispatch('load/loadData', false, { root: true }) // load/loadData
  })
}
