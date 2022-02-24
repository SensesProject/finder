// This module organises the loading of the data

import axios from 'axios'
import { get, isUndefined, set, forEach, find } from 'lodash'
// import { format } from 'timeago.js'
import { STATUS_IDLE, STATUS_LOADING, STATUS_LOADING_FAILED, STATUS_LOADING_SUCCESS, KEY_DATE } from '../config'
import { isTooOld, extractData, buildConfigForRequest, detailPath } from '../../assets/js/utils'
import { basket } from '../index'

const state = () => ({
  data: [],
  details: [],
  status: STATUS_IDLE,
  message: false,
  date: false,
  url: false,
  isCSV: false
})

const mutations = {
  SET_URL_DATA (state, url) {
    state.url = url
  },
  SET_IS_CSV (state, value) { // TODO: Fix naming since it’s no longer loading from Google Sheet
    state.isCSV = value
  },
  API_DATA (state, { status, message, data, details = [] }) {
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
    // We need the data which stores the list of scenarios in order to add the values from each detail request
    if (state.data.length) {
      // Careful! This is only removing the filtered items not all!
      // This is why we remove all filters before loading a new detail.
      basket.remove()
      // We loop over the details which contains each result separately
      forEach(details, ({ runId, variable, year, region, value }) => {
        // We search for the entry in the data
        const entry = find(state.data, { run_id: runId })
        // If we found that item, we add the details to it
        if (entry) {
          entry[detailPath(variable, year, region)] = value
        }
      })

      // console.log('LOAD API_DATA', details.length, state.data.length)
      // console.log('state.data', state.data)
      // Add new data
      basket.add(state.data)
    } else {
      console.warn('Data should not be empty.');
    }
  }
}

const actions = {
  setIsCSV ({ commit }, value) {
    commit('SET_IS_CSV', value)
  },
  setUrlData ({ commit }, url) {
    commit('SET_URL_DATA', url)
  },
  // This starts the loading process. It is triggered by the localStorage or on hard reload
  // This only checks how old the current data from the local storage is
  loadData ({ state, dispatch }, isForced = false) {
    // console.log('Action: Check data', { isForced })
    const lastLoad = get(state, KEY_DATE, null)
    // Is the last loading time longer ago than one day ago or has been loaded before at all
    const shouldReload = isTooOld(lastLoad)
    // Check current data object
    const currentData = get(state, ['data', 'length'], 0)
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
    if (isForced) {
      commit('API_DATA', { status: STATUS_LOADING, data: [] })
    }
    if (isForced || (state.status !== STATUS_LOADING && get(state, ['data', 'length'], 0) === 0)) {
      commit('API_DATA', { status: STATUS_LOADING })
      const { url } = state
      const config = buildConfigForRequest(rootState)

      // console.log('Load Request send')
      axios.get(url, config)
        .then(async (response) => {
          const { data } = response
          // Check were data is coming from
          const datum = state.isCSV ? await extractData(data) : data
          if (datum.length) {
            commit('API_DATA', { status: STATUS_LOADING_SUCCESS, data: datum })
            dispatch('filter/updateDimensions', false, { root: true })
            // Apply filtering
            dispatch('apply', false, { root: true })
            // We need to load the details after appling filters since we need it the run ids from the data
            dispatch('details/initDetails', { isForced }, { root: true })
          } else {
            console.warn('Results should have a length.')
          }
          
        })
        .catch(error => {
          console.log('Loading failed', { error, isLoop })
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
      // We need to load the details after appling filters since we need it for the run ids from the data
      dispatch('details/initDetails', false, { root: true })
    }
  },
  mergeWithDetails ({ commit, rootState, dispatch }, { data = [] }) {
    // This function is called by the details module
    // After the successfull request the details data must be merged with the rest of the data
    // console.log('merge with Details')
    commit('API_DATA', { details: data })
    // console.log('mergeWithDetails: filter/updateDimensions')
    dispatch('filter/updateDimensions', false, { root: true })
    // console.log('mergeWithDetails: apply')
    dispatch('apply', false, { root: true })
    // console.log('mergeWithDetails: end')
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
