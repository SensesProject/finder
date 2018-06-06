import Vue from 'vue'
import Vuex from 'vuex'
import _ from 'lodash'

Vue.use(Vuex)

const store = () => new Vuex.Store({
  state: {
    filter: [{
      'key': 'type',
      'values': ['medium'],
      'all': true
    }],
    data: [{
      'title': 'Robust Decisionmaking',
      'type': 'long',
      'properties': ['group', 'broad', 'fundamental uncertainty'],
      'value': 0,
      'process': 0.1
    },
    {
      'title': 'Scenarios',
      'type': 'long',
      'properties': ['group', 'broad', 'fundamental uncertainty'],
      'value': 1,
      'process': 0.2
    },
    {
      'title': 'Story and Simulation',
      'type': 'long',
      'properties': ['group', 'broad', 'fundamental uncertainty'],
      'value': 2,
      'process': 0.3
    },
    {
      'title': 'Multipattern approach',
      'type': 'medium',
      'properties': ['group', 'narrow', 'broad exploration'],
      'value': 3,
      'process': 0.4
    },
    {
      'title': 'Normative Forecasting',
      'type': 'medium',
      'properties': ['group', 'narrow', 'broad exploration'],
      'value': 4,
      'process': 0.1
    },
    {
      'title': 'Morphological Analysis',
      'type': 'medium',
      'properties': ['group', 'broad', 'broad exploration'],
      'value': 0,
      'process': 0.2
    },
    {
      'title': 'GBN matrix',
      'type': 'short',
      'properties': ['group', 'broad'],
      'value': 1,
      'process': 0.3
    },
    {
      'title': 'Field Anomaly Relaxation',
      'type': 'medium',
      'properties': ['group', 'broad', 'broad exploration'],
      'value': 2,
      'process': 0.4
    },
    {
      'title': 'Anticipatory Action Learning',
      'type': 'long',
      'properties': ['group', 'broad', 'broad exploration'],
      'value': 3,
      'process': 0.1
    },
    {
      'title': 'Causal Layered Analysis',
      'type': 'long',
      'properties': ['group', 'broad', 'broad exploration'],
      'value': 4,
      'process': 0.2
    },
    {
      'title': 'Brainstorming',
      'type': 'short',
      'properties': ['group', 'broad', 'unaminity'],
      'value': 0,
      'process': 0.3
    },
    {
      'title': 'Affinity diagram (card techniques)',
      'type': 'short',
      'properties': ['group', 'broad', 'unaminity'],
      'value': 1,
      'process': 0.4
    },
    {
      'title': 'Nominal Group Technique (card technique)',
      'type': 'short',
      'properties': ['group', 'broad'],
      'value': 2,
      'process': 0.1
    },
    {
      'title': 'Futures Wheel',
      'type': 'short',
      'properties': ['both', 'broad'],
      'value': 3,
      'process': 0.2
    },
    {
      'title': 'Scenario discovery cluster analysis',
      'type': 'medium',
      'properties': ['individual', 'narrow'],
      'value': 4,
      'process': 0.3
    },
    {
      'title': 'Cross over point',
      'type': 'medium',
      'properties': ['both', 'narrow', 'fundamental uncertainty'],
      'value': 0,
      'process': 0.4
    },
    {
      'title': 'Multicriteria analysis',
      'type': 'medium',
      'properties': ['both', 'broad'],
      'value': 1,
      'process': 0.1
    },
    {
      'title': 'Pairwise comparison',
      'type': 'medium',
      'properties': ['both', 'narrow'],
      'value': 2,
      'process': 0.2
    },
    {
      'title': 'STEEP analysis',
      'type': 'short',
      'properties': ['both', 'broad'],
      'value': 3,
      'process': 0.3
    },
    {
      'title': 'SWOT Analysis',
      'type': 'short',
      'properties': ['both', 'broad'],
      'value': 4,
      'process': 0.4
    },
    {
      'title': 'Environmental Scanning',
      'type': 'variable',
      'properties': ['individual'],
      'value': 0,
      'process': 0.1
    },
    {
      'title': 'Text Mining',
      'type': 'variable',
      'properties': ['individual'],
      'value': 1,
      'process': 0.2
    },
    {
      'title': 'Cross-Impact Analysis',
      'type': 'medium',
      'properties': ['both', 'narrow', 'probabilities'],
      'value': 2,
      'process': 0.3
    },
    {
      'title': 'linked Cross Impact Balance',
      'type': 'medium',
      'properties': ['both', 'narrow'],
      'value': 3,
      'process': 0.4
    },
    {
      'title': 'Structural Analysis',
      'type': 'short',
      'properties': ['group', 'narrow'],
      'value': 4,
      'process': 0.1
    },
    {
      'title': 'Cognitive Mapping',
      'type': 'short',
      'properties': ['group', 'broad'],
      'value': 0,
      'process': 0.2
    },
    {
      'title': 'Agent Modeling',
      'type': 'medium',
      'properties': ['both', 'narrow', 'probabilities'],
      'value': 1,
      'process': 0.3
    },
    {
      'title': 'Modeling to Generate Alternatives',
      'type': 'medium',
      'properties': ['individual', 'narrow', 'broad exploration'],
      'value': 2,
      'process': 0.4
    },
    {
      'title': 'Statistical Modeling',
      'type': 'medium',
      'properties': ['individual', 'narrow', 'confidence intervals'],
      'value': 3,
      'process': 0.1
    },
    {
      'title': 'Role playing',
      'type': 'short',
      'properties': ['group', 'broad'],
      'value': 4,
      'process': 0.2
    },
    {
      'title': 'Simulation-Gaming',
      'type': 'short',
      'properties': ['both', 'broad'],
      'value': 0,
      'process': 0.3
    },
    {
      'title': 'Syncon (participatory)',
      'type': 'long',
      'properties': ['group', 'broad'],
      'value': 1,
      'process': 0.4
    },
    {
      'title': 'Search conference (participatory)',
      'type': 'medium',
      'properties': ['group', 'broad'],
      'value': 2,
      'process': 0.1
    },
    {
      'title': 'Workshop (participatory)',
      'type': 'medium',
      'properties': ['group ', 'broad'],
      'value': 3,
      'process': 0.2
    },
    {
      'title': 'Charette (participatory)',
      'type': 'short',
      'properties': ['group', 'broad', 'unaminity'],
      'value': 4,
      'process': 0.3
    },
    {
      'title': 'Expert panel (participatory)',
      'type': 'short',
      'properties': ['group', 'narrow'],
      'value': 0,
      'process': 0.4
    },
    {
      'title': 'Focus group (participatory)',
      'type': 'short',
      'properties': ['group', 'narrow', 'unaminity'],
      'value': 1,
      'process': 0.1
    },
    {
      'title': 'Participatory workshop techniques',
      'type': 'short',
      'properties': ['group', 'broad'],
      'value': 2,
      'process': 0.2
    },
    {
      'title': 'Futures Polygon',
      'type': 'short',
      'properties': ['group', 'narrow', 'probabilities'],
      'value': 3,
      'process': 0.3
    },
    {
      'title': 'Trend Impact Analysis',
      'type': 'short',
      'properties': ['group', 'narrow', 'quartilies'],
      'value': 4,
      'process': 0.4
    },
    {
      'title': 'In-depth interviews',
      'type': 'short',
      'properties': ['one-to-one', 'narrow'],
      'value': 0,
      'process': 0.1
    },
    {
      'title': 'Semi-structured interviews',
      'type': 'short',
      'properties': ['one-to-one', 'broad'],
      'value': 1,
      'process': 0.2
    },
    {
      'title': 'Survey',
      'type': 'short',
      'properties': ['group', 'broad'],
      'value': 2,
      'process': 0.3
    },
    {
      'title': 'Delphi Techniques',
      'type': 'variable',
      'properties': ['group', 'broad', 'unaminity'],
      'value': 3,
      'process': 0.4
    },
    {
      'title': 'Causal Loop diagram',
      'type': 'short',
      'properties': ['both', 'broad'],
      'value': 4,
      'process': 0.1
    },
    {
      'title': 'Fuzzy Cognitive Mapping',
      'type': 'short',
      'properties': ['both', 'broad'],
      'value': 0,
      'process': 0.2
    },
    {
      'title': 'Group model building',
      'type': 'short',
      'properties': ['group', 'broad'],
      'value': 1,
      'process': 0.3
    },
    {
      'title': 'Systems dynamics',
      'type': 'short',
      'properties': ['both', 'broad'],
      'value': 2,
      'process': 0.4
    },
    {
      'title': 'Bayesian network',
      'type': 'medium',
      'properties': ['both', 'broad'],
      'value': 3,
      'process': 0.1
    },
    {
      'title': 'Science and Technology Roadmapping',
      'type': 'medium',
      'properties': ['group', 'narrow', 'probabilities'],
      'value': 4,
      'process': 0.2
    },
    {
      'title': 'Substitution Analysis/ Fisher-Pry Analysis',
      'type': 'short',
      'properties': ['both', 'narrow', 'confidence intervals'],
      'value': 0,
      'process': 0.3
    },
    {
      'title': 'Technological Sequence Analysis',
      'type': 'short',
      'properties': ['both', 'narrow', 'probabilities'],
      'value': 1,
      'process': 0.4
    },
    {
      'title': 'Relevance Trees',
      'type': 'short',
      'properties': ['both', 'broad'],
      'value': 2,
      'process': 0.1
    },
    {
      'title': 'Heuristic Modeling',
      'type': 'medium',
      'properties': ['group', 'broad', 'unaminity'],
      'value': 3,
      'process': 0.2
    },
    {
      'title': 'Visioning',
      'type': 'medium',
      'properties': ['group', 'broad'],
      'value': 4,
      'process': 0.3
    },
    {
      'title': 'Wild Cards',
      'type': 'medium',
      'properties': ['group', 'broad', 'fundamental uncertainty'],
      'value': 0,
      'process': 0.4
    },
    {
      'title': 'Genius Forecasting',
      'type': 'short',
      'properties': ['individual', 'narrow'],
      'value': 1,
      'process': 0.1
    },
    {
      'title': 'Multiple Perspective',
      'type': 'short',
      'properties': ['group', 'broad'],
      'value': 2,
      'process': 0.2
    },
    {
      'title': 'Science fiction',
      'type': 'variable',
      'properties': ['group', 'narrow'],
      'value': 3,
      'process': 0.3
    },
    {
      'title': 'Groupware (participatory)',
      'type': 'throughout',
      'properties': ['group', 'broad'],
      'value': 4,
      'process': 0.4
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
