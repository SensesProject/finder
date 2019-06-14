// FilterEmpty: Hide empty options
// SortRemaining: Sort by remaining amount
// columnHoverEffect: Trigger effect when hovering a column

const state = {
  filterEmpty: false,
  sortRemaining: false,
  columnHoverEffect: false,
  cellHoverEffect: false
}

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
  }
}

export default {
  state,
  mutations,
  actions
}
