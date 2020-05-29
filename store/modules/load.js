import axios from 'axios'
import { get, isUndefined, set } from 'lodash'
import { format } from 'timeago.js'
import { STATUS_IDLE, STATUS_LOADING, STATUS_LOADING_FAILED, STATUS_LOADING_SUCCESS } from '../config'
import { isTooOld, extractFromGoogleTable2 } from '../../assets/js/utils'
import { basket } from '../index'

const state = () => ({
  data: [],
  status: STATUS_IDLE,
  message: false,
  date: false,
  url: false,
  isGoogleSheet: false
})

const mutations = {
  SET_URL_DATA (state, url) {
    state.url = url
  },
  SET_IS_GOOGLE_SHEET (state, value) {
    state.isGoogleSheet = value
  },
  API_DATA (state, { status, message, data }) {
    // Update the status
    state.status = status

    // Add a message. This happens on error
    if (!isUndefined(message)) {
      state.message = message
    }

    // Check if data is being passed and has length
    if (!isUndefined(data) && data.length) {
      // console.log(`Got data with ${data.length} elements`)
      // Set the new data in the state
      state.data = data
      // Safe the current date to get its age the next time
      state.date = new Date()
    }

    // Check if there is data in the state
    // The data could be coming from a request or the localStorage
    // Because it can come from the localStorage this needs to be seperate from the part above
    if (state.data.length) {
      // Remove all previous elements.
      basket.remove(true)

      // Add new data
      basket.add(state.data)
    }
  }
}

const actions = {
  setIsGoogleSheet ({ commit }, value) {
    commit('SET_IS_GOOGLE_SHEET', value)
  },
  setUrlData ({ commit }, url) {
    commit('SET_URL_DATA', url)
  },
  // This starts the loading process. It is triggered by the localStorage or on hard reload
  // This only checks how old the current data from the local storage is
  loadData ({ state, dispatch }, isForced = false) {
    // console.log('Action: Check data', { isForced })
    const lastLoad = get(state, 'date', false)
    // Is the last loading time longer ago than one day ago or has been loaded before at all
    const shouldReload = !lastLoad || isTooOld(lastLoad)
    // Check current data object
    const currentData = get(state, ['data', 'length'], 0)
    // console.log({ currentData })
    // If longer ago, empty or forced (on hard reload)
    const willReload = (shouldReload || !currentData) ? true : isForced
    // if (willReload) {
    //   console.log('Data is too old or reload is forced. Will reload data')
    // }
    // The authorization is called in any case but with varying parameter. The follower is the function called afterwards
    dispatch('auth/auth', { follower: { name: 'load/load' }, isForced: willReload }, { root: true })
  },
  load ({ state, commit, dispatch, rootState }, { isForced, isLoop }) {
    // This function is called after authorization
    // This is the actual function to load data
    // console.log('Action: Load data', { isForced })
    if (isForced) {
      commit('API_DATA', { status: STATUS_LOADING, data: [] })
    }
    if (isForced || (state.status !== STATUS_LOADING && state.data.length === 0)) {
      commit('API_DATA', { status: STATUS_LOADING })
      const { url } = state
      const config = {}

      // Check if there is a url for authorization
      if (get(rootState, ['auth', 'url'], false)) {
        set(config, 'headers.Authorization', `Bearer ${rootState.auth.token}`)
      }
      // console.log('Load Request send')
      axios.get(url, config)
        .then(response => {
          const { data } = response
          // console.log('Loading successfull')
          // Check were data is coming from
          const datum = state.isGoogleSheet ? extractFromGoogleTable2(data) : data
          console.log({ datum })
          commit('API_DATA', { status: STATUS_LOADING_SUCCESS, data: datum })
          dispatch('filter/updateDimensions', false, { root: true })

          // Apply filtering
          dispatch('apply', false, { root: true })
        })
        .catch(error => {
          // console.log('Loading failed', { error, isLoop })
          commit('API_DATA', { status: STATUS_LOADING_FAILED, message: error })
          if (!isLoop) {
            // console.log('Trying to relogin')
            dispatch('auth/auth', { follower: { name: 'load/load' }, isForced: true }, { root: true })
          }
        })
    } else {
      // console.log('Data already loaded', format(state.date))
      // console.log('Data:', state.data)
      commit('API_DATA', { status: STATUS_LOADING_SUCCESS })
      dispatch('filter/updateDimensions', false, { root: true })
      dispatch('apply', false, { root: true })
    }
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
