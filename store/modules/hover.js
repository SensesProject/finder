// HoverValue is defined key and a value. This is used for single cells
// Hover key is a key. This is used for columns

const state = {
  hoverValue: false,
  hoverKey: false
}

const mutations = {
  SET_HOVER_VALUE (state, { key, value }) {
    state.hoverValue = {
      key,
      value
    }
  },
  RESET_HOVER_VALUE (state) {
    state.hoverValue = false
  },
  SET_HOVER_KEY (state, { key }) {
    state.hoverKey = key
  },
  RESET_HOVER_KEY (state) {
    state.hoverKey = false
  }
}

const actions = {
  setHoverValue ({ commit }, { key, value }) {
    commit('SET_HOVER_VALUE', { key, value })
  },
  resetHoverValue ({ commit }) {
    commit('RESET_HOVER_VALUE')
  },
  setHoverKey ({ commit }, { key }) {
    commit('SET_HOVER_KEY', { key })
  },
  resetHoverKey ({ commit }) {
    commit('RESET_HOVER_KEY')
  }
}

export default {
  state,
  mutations,
  actions
}
