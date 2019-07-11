import Vue from 'vue'
import Vuex from 'vuex'
import _ from 'lodash'
import { VTooltip, VPopover, VClosePopover } from 'v-tooltip'
import auth from './modules/auth'
import data from './modules/data'
import facet from './modules/facet'
import hover from './modules/hover'
import options from './modules/options'
import popover from './modules/popover'

Vue.use(Vuex)
Vue.directive('tooltip', VTooltip)
Vue.directive('close-popover', VClosePopover)
Vue.component('v-popover', VPopover)

const store = () => new Vuex.Store({
  modules: {
    auth,
    data,
    facet,
    hover,
    options,
    popover
  },
  state: {
    facets: []
  },
  getters: {
    titles: state => {
      return _.map(_.filter(state.facets, 'title'), 'key')
    },
    visibleHeader: state => {
      // Get a list of all keys from the facets
      // This is used for the Table view to build each row
      return _.map(state.facets, 'key')
    }
  },
  mutations: {
    SET_CONTENT (state, { facets }) {
      // Sets the content of the Finder. It is triggered by setContent in the Wrapper component
      state.facets = facets
    }
  },
  actions: {
    setContent ({ commit }, obj) {
      // Sets the content of the Finder. It is called by the Wrapper component
      // console.log('setHover')
      commit('SET_CONTENT', obj)
    }
  }
})

export default store
