import Vue from 'vue'
import Vuex from 'vuex'
import { VTooltip, VPopover, VClosePopover } from 'v-tooltip'
import auth from './modules/auth'
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

const store = () => new Vuex.Store({
  modules: {
    auth,
    data,
    facets,
    filter,
    hover,
    id,
    options,
    popover
  }
})

export default store
