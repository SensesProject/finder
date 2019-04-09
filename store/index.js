import Vue from 'vue'
import Vuex from 'vuex'
import _ from 'lodash'
import VTooltip from 'v-tooltip'
import popover from './modules/popover'
import data from './modules/data'

Vue.use(Vuex)
Vue.use(VTooltip)

const store = () => new Vuex.Store({
  modules: {
    popover,
    data
  },
  state: {
    optionsFilter: false,
    sortRemaining: false,
    hover: false,
    filter: [],
    activeKey: false,
    facets: [],
    popoverContent: {}
  },
  getters: {
    titles: state => {
      return _.map(_.filter(state.facets, 'title'), 'key')
    },
    visibleHeader: state => {
      // implement toggle option for columns
      return _.map(state.facets, 'key')
    }
  },
  mutations: {
    RESET_FILTER (state) {
      state.filter = []
    },
    RESET_FACET (state, key) {
      // console.log('RESET_FACET', key)
      state.filter = _.reject(state.filter, ['key', key])
    },
    SET_FACET (state, { key, value }) {
      // console.log('SET_FACET', key, value)
      const filter = _.clone(state.filter)
      filter.push({
        'key': key,
        'values': [value],
        'invert': false
      })
      state.filter = filter
    },
    ADD_FACET (state, { key, value }) {
      // console.log('SET_FACET', key, value)
      const filter = _.clone(state.filter)
      const facet = _.find(filter, ['key', key])
      facet.values.push(value)
      state.filter = filter
    },
    INVERT_FACET (state, { key }) {
      // console.log('SET_FACET', key, value)
      const filter = _.clone(state.filter)
      const facet = _.find(filter, ['key', key])
      facet.invert = !facet.invert
      state.filter = filter
    },
    REMOVE_FACET (state, { key, value }) {
      // console.log('SET_FACET', key, value)
      const filter = _.clone(state.filter)
      const facet = _.find(filter, ['key', key])
      _.pull(facet.values, value)
      if (facet.values.length === 0) {
        state.filter = _.reject(state.filter, ['key', key])
      } else {
        state.filter = filter
      }
      // console.log(filter)
    },
    SET_HOVER (state, { key, value }) {
      // console.log('SET_HOVER', key, value)
      state.hover = {
        key,
        value
      }
    },
    RESET_HOVER (state) {
      state.hover = false
    },
    SET_HOVER_KEY (state, { key }) {
      // console.log('SET_HOVER', key, value)
      state.activeKey = key
    },
    RESET_HOVER_KEY (state) {
      // console.log('SET_HOVER', key, value)
      state.activeKey = false
    },
    SET_OPTIONS_FILTER (state, { value }) {
      state.optionsFilter = value
    },
    SET_SORT_REMAINING (state, { value }) {
      state.sortRemaining = value
    },
    SET_CONTENT (state, { data, facets, popovers }) {
      // Sets the content of the Finder. It is triggered by setContent in the Wrapper component
      // state.data = data.items
      state.popoverContent = _.fromPairs(_.map(popovers, popover => {
        return [popover, _.get(data, popover, {})]
      }))
      state.facets = facets
    }
  },
  actions: {
    resetFilter ({ commit }) {
      commit('RESET_FILTER')
    },
    resetFacet ({ commit }, key) {
      // console.log('resetFacet')
      commit('RESET_FACET', key)
    },
    setFacet ({ commit }, { key, value }) {
      // console.log('setFacet', key, value)
      commit('RESET_FACET', key)
      commit('SET_FACET', { key, value })
    },
    addFacet ({ commit }, { key, value }) {
      // console.log('addFacet', key, value)
      commit('ADD_FACET', { key, value })
    },
    removeFacet ({ commit }, { key, value }) {
      // console.log('removeFacet', key, value)
      commit('REMOVE_FACET', { key, value })
    },
    invertFacet ({ commit }, key) {
      // console.log('invertFacet', key)
      commit('INVERT_FACET', { key })
    },
    setHover ({ commit }, { key, value }) {
      // console.log('setHover', key, value)
      commit('SET_HOVER', { key, value })
    },
    resetHover ({ commit }) {
      // console.log('setHover')
      commit('RESET_HOVER')
    },
    setHoverKey ({ commit }, { key }) {
      // console.log('setHover', key, value)
      commit('SET_HOVER_KEY', { key })
    },
    resetHoverKey ({ commit }) {
      // console.log('setHover')
      commit('RESET_HOVER_KEY')
    },
    setOptionsFilter ({ commit }, { value }) {
      // console.log('setHover')
      commit('SET_OPTIONS_FILTER', { value })
    },
    setSortRemaining ({ commit }, { value }) {
      // console.log('setHover')
      commit('SET_SORT_REMAINING', { value })
    },
    setContent ({ commit }, obj) {
      // Sets the content of the Finder. It is called by the Wrapper component
      // console.log('setHover')
      commit('SET_CONTENT', obj)
    }
  }
})

export default store
