const state = {
  popover: false,
  popoverContent: {}
}

const mutations = {
  CLOSE_POPOVER (state) {
    state.popover = false
  },
  OPEN_POPOVER (state, key) {
    state.popover = key
  }
}

const actions = {
  closePopover ({ commit }) {
    commit('CLOSE_POPOVER')
  },
  openPopover ({ commit }, key) {
    commit('OPEN_POPOVER', key)
  }
}

export default {
  state,
  mutations,
  actions
}
