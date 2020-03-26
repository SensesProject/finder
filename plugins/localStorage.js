import createPersistedState from 'vuex-persistedstate'

export default ({ store }) => {
  window.onNuxtReady(() => {
    const { dispatch, state } = store
    createPersistedState({
      // This id must be unique for each Finder instance on the same url
      key: state.id.id,
      // These are the paths of the data that is stored in the localStorage
      paths: ['data.data', 'auth.token', 'data.status', 'data.date', 'auth.date', 'facets.facets', 'facets.date']
    })(store)
    // Load the facets (from the Google Sheet)
    dispatch('loadFacets') // facets/loadFacets
    // Then also load the data in parallel
    dispatch('loadData') // load/loadData
  })
}
