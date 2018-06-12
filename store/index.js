import Vue from 'vue'
import Vuex from 'vuex'
import _ from 'lodash'
import * as data from '../data/data.json'

Vue.use(Vuex)

const store = () => new Vuex.Store({
  state: {
    hover: false,
    filter: [],
    activeKey: 'Time Duration',
    facets: [{
      'label': 'Technique or Method',
      'key': 'Technique or Method',
      'type': 'category'
    }, {
      'label': 'Time Duration',
      'key': 'Time Duration',
      'type': 'category'
    }, {
      'label': 'narrow/ broad participation',
      'key': 'narrow/ broad participation',
      'type': 'category'
    }, {
      'label': 'Experts',
      'key': 'Experts',
      'type': 'category'
    }, {
      'label': 'stakeholders',
      'key': 'stakeholders',
      'type': 'category'
    }, {
      'label': 'group/individual',
      'key': 'group/individual',
      'type': 'category'
    }, {
      'label': 'can be performed in a 1 day workshop',
      'key': 'can be performed in a 1 day workshop',
      'type': 'category'
    }],
    data,
    header: [
      'Name',
      'Technique or Method',
      'Type (grouping of techniques)',
      'Time Duration',
      'narrow/ broad participation',
      'Experts',
      'stakeholders',
      'group/individual',
      'can be performed in a 1 day workshop',
      'in person',
      'distance/ online',
      'Backward (normative)',
      'Forward (explorative)',
      'Quantitative',
      'Qualitative',
      'Translation tools',
      'reduce ambiguity',
      'allow ambiguity',
      'creative',
      'evidence-based (systematic)',
      'fundamental, broad exploration, probabilty, statistical',
      'Under-stand',
      'Generate ideas',
      'Integrate ideas into whole',
      'Consistency',
      'Decision',
      'Column',
      'Analysis',
      'Syntheis',
      'creation',
      'Column2'
    ]
  },
  getters: {
    // header: state => {
    //   return Object.keys(state.data[0])
    // },
    options: state => {
      return state.facets.map(facet => {
        const { key } = facet
        const options = _.countBy(_.flatten(state.data.map(item => item[key])))
        // console.log(options)
        return {
          ...facet,
          options
        }
      })
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
      // console.log('RESET_FACET', key)
      state.filter = _.reject(state.filter, ['key', key])
    },
    SET_FACET (state, { key, value }) {
      // console.log('SET_FACET', key, value)
      const filter = _.clone(state.filter)
      filter.push({
        'key': key,
        'values': [value],
        'all': true
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
    }
  }
})

export default store
