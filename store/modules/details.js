// This module handles detail requests. For the scenario database, some field allow the user to request more data
import axios from 'axios'
import { get, isUndefined, set, filter, map, forEach } from 'lodash'
import { format } from 'timeago.js'
import { STATUS_IDLE, STATUS_LOADING, STATUS_LOADING_FAILED, STATUS_LOADING_SUCCESS, KEY_DATE, KEY_ID } from '../config'
import { isTooOld, extractFromGoogleTable2 } from '../../assets/js/utils'
import { basket } from '../index'

const state = () => ({
  data: [],
  url: false
})

const mutations = {
  SET_URL_DETAILS (state, url) {
    state.url = url
  },
  API_DETAILS (state, { data, body }) {
    // Check if data is being passed and has length
    if (!isUndefined(data) && data.length) {
      // console.log(`Got data with ${data.length} elements`)
      // Set the new data in the state

      const region = get(body, ['filters', 'regions', 0], false)
      const variable = get(body, ['filters', 'variables', 0], false)
      const year = get(body, ['filters', 'years', 0], false)

      console.log({region, variable, year})

      if (region && variable && year) {
        state.data.push({
          [KEY_DATE]: new Date(),
          data,
          region,
          variable,
          year
        })
      }
    }
    console.log(state.data)
  }
}

const actions = {
  setUrlDetails ({ commit }, url) {
    commit('SET_URL_DETAILS', url)
  },
  initDetails ({ state, dispatch, rootState }, isForced = false) {
    const facets = filter(get(rootState, ['facets', 'allFacets']), { type: 'Details' })
    console.log(facets)
    dispatch('loadDetails', { list: facets, isForced })
  },
  // This starts the loading process. It is triggered by the localStorage or on hard reload
  // This only checks how old the current data from the local storage is
  loadDetails ({ state, dispatch, rootState }, payload) {
    const list = get(payload, 'list', [])
    const isForced = get(payload, 'isForced', false)
    console.log('load Details', list, isForced)
    const requests = isForced ? list : filter(list, item => {
      const cache = find(state.data, { variable: item.key, year: 2030, region: 'World' })
      const lastLoad = get(cache, KEY_DATE, null)
      if (!cache) {
        console.log('Is not in cache')
      } else if (isTooOld(lastLoad)) {
        console.log('Is too old')
      }
      return !cache || isTooOld(lastLoad)
    })
    console.log('result:', requests)
    dispatch('auth/auth', { follower: { name: 'details/load', params: { requests } }, isForced: false }, { root: true })
  },
  load ({ state, commit, dispatch, rootState }, { requests }) {
    console.log('loaddetails', requests)

    const runs = map(basket.dimension((d) => get(d, 'run_id', false)).group().all(), 'key')

    console.log(runs)
    console.log(runs)
    const { url } = state
    const config = {}

    // Check if there is a url for authorization
    if (get(rootState, ['auth', 'url'], false)) {
      set(config, 'headers.Authorization', `Bearer ${rootState.auth.token}`)
    }

    forEach(requests, ({ key }) => {
      const body = {
        filters: {
          runs,
          years: [2030],
          regions: ['World'],
          variables: [key]
        }
      }

      console.log(body)

      axios.post(url, body, config)
        .then(response => {
          const { data } = response
          console.log('Loading successfull')
          // Check were data is coming from
          // const datum = state.isGoogleSheet ? extractFromGoogleTable2(data) : data
          console.log({ data, body })
          commit('API_DETAILS', { data, body })
          dispatch('load/mergeWithDetails', { data }, { root: true })

          // // Apply filtering
          // dispatch('apply', false, { root: true })
        })
        .catch(error => {
          console.log('Loading failed', { error })
          // commit('API_DATA', { status: STATUS_LOADING_FAILED, message: error })
          // if (!isLoop) {
          //   // console.log('Trying to relogin')
          //   dispatch('auth/auth', { follower: { name: 'load/load' }, isForced: true }, { root: true })
          // }
        })
    })


    // This function is called after authorization
    // This is the actual function to load data
    // console.log('Action: Load data', { isForced })
    // if (isForced) {
    //   commit('API_DATA', { status: STATUS_LOADING, data: [] })
    // }
    // if (isForced || (state.status !== STATUS_LOADING && get(state, ['data', 'length'], 0) === 0)) {
    //   commit('API_DATA', { status: STATUS_LOADING })
    //   const { url } = state
    //   const config = {}

    //   // Check if there is a url for authorization
    //   if (get(rootState, ['auth', 'url'], false)) {
    //     set(config, 'headers.Authorization', `Bearer ${rootState.auth.token}`)
    //   }
    //   // console.log('Load Request send')
    //   axios.get(url, config)
    //     .then(response => {
    //       const { data } = response
    //       console.log('Loading successfull')
    //       // Check were data is coming from
    //       const datum = state.isGoogleSheet ? extractFromGoogleTable2(data) : data
    //       console.log({ datum })
    //       commit('API_DATA', { status: STATUS_LOADING_SUCCESS, data: datum })
    //       dispatch('filter/updateDimensions', false, { root: true })

    //       // Apply filtering
    //       dispatch('apply', false, { root: true })
    //     })
    //     .catch(error => {
    //       // console.log('Loading failed', { error, isLoop })
    //       commit('API_DATA', { status: STATUS_LOADING_FAILED, message: error })
    //       if (!isLoop) {
    //         // console.log('Trying to relogin')
    //         dispatch('auth/auth', { follower: { name: 'load/load' }, isForced: true }, { root: true })
    //       }
    //     })
    // } else {
    //   // console.log('Data already loaded', format(state.date))
    //   // console.log('Data:', state.data)
    //   commit('API_DATA', { status: STATUS_LOADING_SUCCESS })
    //   dispatch('filter/updateDimensions', false, { root: true })
    //   dispatch('apply', false, { root: true })
    // }
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
