// This module holds the options set by the user

const state = () => ({
  filterEmpty: false, // Hide empty options
  sortRemaining: false, // Sort by remaining amount
  columnHoverEffect: false, // Trigger effect when hovering a column
  cellHoverEffect: false, // Trigger effect when hovering a cell
  displayURL: false // Should the url change according to the filter
})

const mutations = {
  SET_FILTER_EMPTY (state, { value }) {
    state.filterEmpty = value
  },
  SET_SORT_REMAINING (state, { value }) {
    state.sortRemaining = value
  },
  SET_COLUMN_HOVER_EFFECT (state, { value }) {
    state.columnHoverEffect = value
  },
  SET_CELL_HOVER_EFFECT (state, { value }) {
    state.cellHoverEffect = value
  },
  SET_DISPLAY_URL (state, value) {
    state.displayURL = value
  }
}

const actions = {
  setFilterEmpty ({ commit }, { value }) {
    commit('SET_FILTER_EMPTY', { value })
  },
  setSortRemaining ({ commit }, { value }) {
    commit('SET_SORT_REMAINING', { value })
  },
  setColumnHoverEffect ({ commit }, { value }) {
    commit('SET_COLUMN_HOVER_EFFECT', { value })
    if (!value) {
      commit('RESET_HOVER_KEY')
    }
  },
  setCellHoverEffect ({ commit }, { value }) {
    commit('SET_CELL_HOVER_EFFECT', { value })
    if (!value) {
      commit('RESET_HOVER_VALUE')
    }
  },
  setDisplayURL ({ commit }, value) {
    commit('SET_DISPLAY_URL', value)
  }
}

export default {
  state,
  mutations,
  actions
}
