import createPersistedState from 'vuex-persistedstate'
import { KEY_DATE, KEY_FACETS_ALL } from '~/store/config'

export default ({ store }) => {
  window.onNuxtReady(() => {
    const { dispatch, state } = store
    createPersistedState({
      // This id must be unique for each Finder instance on the same url
      key: state.id.id,
      // These are the paths of the data that is stored in the localStorage
      paths: ['load.data', 'auth.token', 'load.status', `load.${KEY_DATE}`, `auth.${KEY_DATE}`, `facets.${KEY_FACETS_ALL}`, `facets.${KEY_DATE}`]
    })(store)
    // Load the facets (from the Google Sheet)
    dispatch('facets/loadFacets', false, { root: true }) // facets/loadFacets
    // Then also load the data in parallel
    dispatch('load/loadData', false, { root: true }) // load/loadData
  })
}
