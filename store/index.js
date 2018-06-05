import Vue from 'vue'
import Vuex from 'vuex'
import _ from 'lodash'

Vue.use(Vuex)

const store = () => new Vuex.Store({
  state: {
    filter: [{
      'key': 'type',
      'values': ['addition'],
      'all': true
    }],
    data: [{
      'title': 'He moonlight',
      'type': 'sportsmen',
      'properties': ['devonshire', 'difficulty', 'assistance', 'joy'],
      'value': 12,
      'process': 0.65
    }, {
      'title': 'Him boisterous',
      'type': 'addition',
      'properties': ['frequently', 'inquietude', 'ourselves', 'comfort'],
      'value': 42,
      'process': 0.12
    }, {
      'title': 'He moonlight',
      'type': 'sportsmen',
      'properties': ['devonshire', 'difficulty', 'ourselves', 'comfort'],
      'value': 62,
      'process': 0.35
    }, {
      'title': 'He moonlight',
      'type': 'dejection',
      'properties': ['devonshire', 'inquietude', 'frequently'],
      'value': 74,
      'process': 0.64
    }, {
      'title': 'He moonlight',
      'type': 'addition',
      'properties': ['ourselves', 'difficulty', 'assistance'],
      'value': 72,
      'process': 0.74
    }, {
      'title': 'He moonlight',
      'type': 'addition',
      'properties': ['frequently', 'difficulty', 'assistance'],
      'value': 23,
      'process': 0.83
    }]
  },
  getters: {
    header: state => {
      return Object.keys(state.data[0])
    },
    types: state => {
      return _.countBy(state.data.map(item => item['type']))
    },
    properties: state => {
      return _.countBy(_.flatten(state.data.map(item => item['properties'])))
    },
    values: state => {
      const values = state.data.map(item => item['value'])
      const counting = _.countBy(values)
      const min = Math.min(...values)
      const max = Math.max(...values)
      const range = [min, max]
      return {
        counting,
        range
      }
    },
    process: state => {
      return _.countBy(state.data.map(item => item['process']))
    },
    result: (state, getters) => {
      let result = state.data
      state.filter.forEach(filta => {
        result = result.filter(item => {
          // console.log(filta.key, item[filta.key], filta.values, _.indexOf(filta.values, item[filta.key]))
          if (_.isArray(item[filta.key])) {
            return _.intersection(item[filta.key], filta.values).length > 0
          } else {
            return _.indexOf(filta.values, item[filta.key]) > -1
          }
        })
      })
      return result
    }
  },
  mutations: {
    RESET_FILTER (state) {
      state.filter = []
    },
    RESET_FACET (state, key) {
      console.log('RESET_FACET', key)
      state.filter = _.reject(state.filter, ['key', key])
    },
    SET_FACET (state, { key, value }) {
      console.log('SET_FACET', key, value)
      const filter = _.clone(state.filter)
      filter.push({
        'key': key,
        'values': [value],
        'all': true
      })
      state.filter = filter
    },
    ADD_FACET (state, { key, value }) {
      console.log('SET_FACET', key, value)
      const filter = _.clone(state.filter)
      const facet = _.find(filter, ['key', key])
      facet.values.push(value)
      state.filter = filter
    },
    REMOVE_FACET (state, { key, value }) {
      console.log('SET_FACET', key, value)
      const filter = _.clone(state.filter)
      const facet = _.find(filter, ['key', key])
      _.pull(facet.values, value)
      if (facet.values.length === 0) {
        state.filter = _.reject(state.filter, ['key', key])
      } else {
        state.filter = filter
      }
      // console.log(filter)
    }
  },
  actions: {
    resetFilter ({ commit }) {
      commit('RESET_FILTER')
    },
    resetFacet ({ commit }, key) {
      console.log('resetFacet')
      commit('RESET_FACET', key)
    },
    setFacet ({ commit }, { key, value }) {
      console.log('setFacet', key, value)
      commit('RESET_FACET', key)
      commit('SET_FACET', { key, value })
    },
    addFacet ({ commit }, { key, value }) {
      console.log('addFacet', key, value)
      commit('ADD_FACET', { key, value })
    },
    removeFacet ({ commit }, { key, value }) {
      console.log('removeFacet', key, value)
      commit('REMOVE_FACET', { key, value })
    }
  }
})

export default store
