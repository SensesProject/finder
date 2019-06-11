// FilterEmpty: Hide empty options
// SortRemaining: Sort by remaining amount

const state = {
  filterEmpty: false,
  sortRemaining: false
}

const mutations = {
  SET_FILTER_EMPTY (state, { value }) {
    state.filterEmpty = value
  },
  SET_SORT_REMAINING (state, { value }) {
    state.sortRemaining = value
  }
}

const actions = {
  setFilterEmpty ({ commit }, { value }) {
    // console.log('setHover')
    commit('SET_FILTER_EMPTY', { value })
  },
  setSortRemaining ({ commit }, { value }) {
    // console.log('setHover')
    commit('SET_SORT_REMAINING', { value })
  }
}

export default {
  state,
  mutations,
  actions
}
