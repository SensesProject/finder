// This modules organises the resulting items, its navigation and the counting
import { basket } from '../index'
import { KEY_ID, ITEMS_PER_PAGE } from '../config'
import { get } from 'lodash'

let datum
let all

// This module organises the filtered data in the table
const state = () => {
  return {
    datum: [], // The current remaining items to be displayed in the table
    count: [0, 0], // Amount of remaining items / Amount of total items
    offset: 0, // The offset for the results
    numberOfPages: 0
  }
}

const mutations = {
  INIT () {
    // console.log('datum/INIT')
    // This function must be called in the beginning
    // It initiates the basket by creating new dimension
    datum = basket.dimension(d => get(d, KEY_ID))
    // This defines a group of results that hold all items
    all = basket.groupAll()
  },
  FILTER (state) {
    // console.log('datum/FILTER')
    // This must be commited everytime a filter is applied.
    // This is called by the apply function in the root store
    // This sets the new filtered items as the new data
    state.datum = datum.bottom(ITEMS_PER_PAGE, state.offset)
    // console.log('datum:', state.datum)
  },
  COUNT (state) {
    // console.log('datum/COUNT')
    // This must be commited everytime a filter is applied.
    // This is called by the apply function the root store
    // This sets the new counting results
    const total = basket.size()
    state.count = [all.value(), total]
    state.numberOfPages = Math.ceil((total || 0) / ITEMS_PER_PAGE)
    // console.log('count:', total, state.count, state.numberOfPages)
  },
  SET_OFFSET (state, offset) {
    // console.log('datum/SET_OFFSET')
    // This mutation is triggered by the Table
    state.offset = offset
  }
}

const actions = {
  setOffset ({ commit }, page) {
    // Calculate the offset from the items per page
    commit('SET_OFFSET', page * ITEMS_PER_PAGE)
    // Apply the new offset
    commit('FILTER')
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
