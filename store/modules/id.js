// TODO: Not sure where this is used
const DEFAULT_ID = 'default'

const state = () => ({
  id: DEFAULT_ID
})

const mutations = {
  SET_ID (state, id) {
    state.id = id
  }
}

const actions = {
  setID ({ commit }, id) {
    commit('SET_ID', id)
  }
}

export default {
  state,
  mutations,
  actions
}
