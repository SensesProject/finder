import Vue from 'vue'
import Vuex from 'vuex'
import { VTooltip, VPopover, VClosePopover } from 'v-tooltip'
import VueDraggableResizable from 'vue-draggable-resizable'
import crossfilter from 'crossfilter2'
import auth from './modules/auth'
import load from './modules/load'
import data from './modules/data'
import facets from './modules/facets'
import filter from './modules/filter'
import hover from './modules/hover'
import id from './modules/id'
import options from './modules/options'
import popover from './modules/popover'
import datum from './modules/datum'
import url from './modules/url'

Vue.use(Vuex)
Vue.directive('tooltip', VTooltip)
Vue.directive('close-popover', VClosePopover)
Vue.component('v-popover', VPopover)
Vue.component('vue-draggable-resizable', VueDraggableResizable)

export const basket = crossfilter([])

export default () => new Vuex.Store({
  modules: {
    auth,
    load,
    data,
    facets,
    filter,
    hover,
    id,
    options,
    popover,
    datum,
    url
  },
  actions: {
    initFinder ({ commit }) {
      // console.log('/initFinder')
      // This initiates the Finder »engine«. This is called from the Finder component after creation
      commit('datum/INIT')
    },
    apply ({ commit, dispatch }) {
      // console.log('+++ APPLY ROOT +++')
      // This is called everytime the filter change
      // This applies the filter to the elements
      commit('datum/FILTER')
      // This counts the remaining elements
      commit('datum/COUNT')
      // This updates the counting in the facets
      dispatch('facets/filter')
    }
  }
})
