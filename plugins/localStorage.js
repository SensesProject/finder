import createPersistedState from 'vuex-persistedstate'

export default ({ store }) => {
  window.onNuxtReady(() => {
    const { dispatch } = store
    createPersistedState({
      paths: ['data.data', 'auth.token', 'data.status']
    })(store)
    dispatch('loadData')
  })
}
