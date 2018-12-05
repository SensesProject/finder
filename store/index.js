import Vue from 'vue'
import Vuex from 'vuex'
import _ from 'lodash'

Vue.use(Vuex)

const store = () => new Vuex.Store({
  state: {
    optionsFilter: false,
    sortRemaining: false,
    hover: false,
    filter: [],
    activeKey: false,
    facets: [],
    data: []
  },
  getters: {
    datum: state => {
      return _.map(state.data, datum => {
        return _.fromPairs(_.map(state.facets, facet => {
          let label
          const value = datum[facet.key] || '—'
          if (facet.type === 'category') {
            label = value.replace(/[_-]/g, ' ')
          } else if (facet.type === 'number') {
            label = _.round(value, facet.precision)
          }
          const obj = {
            value,
            label,
            hasPopover: !_.isUndefined(facet.hasPopover)
          }
          return [facet.key, obj]
        }))
      })
    },
    options: (state, getters) => {
      const facets = state.facets.filter(facet => !facet.title)
      return facets.map(facet => {
        const { key } = facet
        // Count all options for that facet (respectively key)
        const options = _.countBy(_.flatten(getters.datum.map(item => {
          return item[key].label
        })))
        return {
          ...facet,
          options
        }
      })
    },
    visibleHeader: state => {
      // implement toggle option for columns
      return _.map(state.facets, 'key')
    },
    process: state => {
      return _.countBy(state.data.map(item => item['process']))
    },
    result: (state, getters) => {
      let result = getters.datum
      state.filter.forEach(filta => {
        result = result.filter(item => {
          // console.log(filta.key, item[filta.key], filta.values, _.indexOf(filta.values, item[filta.key]))
          let retVal = true
          if (_.isArray(item[filta.key])) { // TODO: Does this ever happen?
            retVal = _.intersection(item[filta.key].label, filta.values).length > 0
          } else {
            retVal = _.indexOf(filta.values, item[filta.key].label) > -1
          }
          return filta.invert ? !retVal : retVal
        })
      })
      return result
    },
    counter: (state, getters) => {
      console.log('counter', getters.result)
      const values = state.facets.map(facet => {
        const { key } = facet
        const options = _.countBy(_.flatten(getters.result.map(item => item[key].label)))
        return [key, options]
      })
      return _.fromPairs(values)
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
    SET_CONTENT (state, { data, facets }) {
      state.data = data
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
    setContent ({ commit }, { data, facets }) {
      // console.log('setHover')
      commit('SET_CONTENT', { data, facets })
    }
  }
})

export default store
