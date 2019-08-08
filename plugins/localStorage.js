import createPersistedState from 'vuex-persistedstate'

export default ({ store }) => {
  window.onNuxtReady(() => {
    const { dispatch, state } = store
    createPersistedState({
      key: state.id.id,
      paths: ['data.data', 'auth.token', 'data.status', 'data.date', 'auth.date']
    })(store)
    dispatch('loadData')
  })
}
