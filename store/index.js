import Vue from 'vue'
import Vuex from 'vuex'
import { VTooltip, VPopover, VClosePopover } from 'v-tooltip'
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

Vue.use(Vuex)
Vue.directive('tooltip', VTooltip)
Vue.directive('close-popover', VClosePopover)
Vue.component('v-popover', VPopover)

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
    popover
  }
})
