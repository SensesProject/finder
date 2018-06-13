import Vue from 'vue'
import Vuex from 'vuex'
import _ from 'lodash'
import * as data from '../data/data.json'

Vue.use(Vuex)

const store = () => new Vuex.Store({
  state: {
    optionsFilter: false,
    sortRemaining: false,
    hover: false,
    filter: [],
    activeKey: 'Time Duration',
    facets: [{
      'label': 'Name',
      'key': 'Name',
      'type': 'category'
    },
    {
      'label': 'Technique or Method',
      'key': 'Technique or Method',
      'type': 'category'
    },
    {
      'label': 'Type (grouping of techniques)',
      'key': 'Type (grouping of techniques)',
      'type': 'category'
    },
    {
      'label': 'Time Duration',
      'key': 'Time Duration',
      'type': 'category'
    },
    {
      'label': 'narrow/ broad participation',
      'key': 'narrow/ broad participation',
      'type': 'category'
    },
    {
      'label': 'Experts',
      'key': 'Experts',
      'type': 'category'
    },
    {
      'label': 'stakeholders',
      'key': 'stakeholders',
      'type': 'category'
    },
    {
      'label': 'group/individual',
      'key': 'group/individual',
      'type': 'category'
    },
    {
      'label': 'can be performed in a 1 day workshop',
      'key': 'can be performed in a 1 day workshop',
      'type': 'category'
    },
    {
      'label': 'in person',
      'key': 'in person',
      'type': 'category'
    },
    {
      'label': 'distance/ online',
      'key': 'distance/ online',
      'type': 'category'
    },
    {
      'label': 'Backward (normative)',
      'key': 'Backward (normative)',
      'type': 'category'
    },
    {
      'label': 'Forward (explorative)',
      'key': 'Forward (explorative)',
      'type': 'category'
    },
    {
      'label': 'Quantitative',
      'key': 'Quantitative',
      'type': 'category'
    },
    {
      'label': 'Qualitative',
      'key': 'Qualitative',
      'type': 'category'
    },
    {
      'label': 'Translation tools',
      'key': 'Translation tools',
      'type': 'category'
    },
    {
      'label': 'reduce ambiguity',
      'key': 'reduce ambiguity',
      'type': 'category'
    },
    {
      'label': 'allow ambiguity',
      'key': 'allow ambiguity',
      'type': 'category'
    },
    {
      'label': 'creative',
      'key': 'creative',
      'type': 'category'
    },
    {
      'label': 'evidence-based (systematic)',
      'key': 'evidence-based (systematic)',
      'type': 'category'
    },
    {
      'label': 'fundamental, broad exploration, probabilty, statistical',
      'key': 'fundamental, broad exploration, probabilty, statistical',
      'type': 'category'
    },
    {
      'label': 'Under-stand',
      'key': 'Under-stand',
      'type': 'category'
    },
    {
      'label': 'Generate ideas',
      'key': 'Generate ideas',
      'type': 'category'
    },
    {
      'label': 'Integrate ideas into whole',
      'key': 'Integrate ideas into whole',
      'type': 'category'
    },
    {
      'label': 'Consistency',
      'key': 'Consistency',
      'type': 'category'
    },
    {
      'label': 'Decision',
      'key': 'Decision',
      'type': 'category'
    },
    {
      'label': 'Analysis',
      'key': 'Analysis',
      'type': 'category'
    },
    {
      'label': 'Syntheis',
      'key': 'Syntheis',
      'type': 'category'
    },
    {
      'label': 'creation',
      'key': 'creation',
      'type': 'category'
    },
    {
      'label': 'Column2',
      'key': 'Column2',
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
          let retVal = true
          if (_.isArray(item[filta.key])) {
            retVal = _.intersection(item[filta.key], filta.values).length > 0
          } else {
            retVal = _.indexOf(filta.values, item[filta.key]) > -1
          }
          return filta.invert ? !retVal : retVal
        })
      })
      return result
    },
    counter: (state, getters) => {
      const values = state.facets.map(facet => {
        const { key } = facet
        const options = _.countBy(_.flatten(getters.result.map(item => item[key])))
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
    }
  }
})

export default store
