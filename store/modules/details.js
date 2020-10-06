// This module handles detail requests. For the scenario database, some field allow the user to request more data
import axios from 'axios'
import { get, isUndefined, set, filter, map, forEach, find } from 'lodash'
import { format } from 'timeago.js'
import { STATUS_IDLE, STATUS_LOADING, STATUS_LOADING_FAILED, STATUS_LOADING_SUCCESS, KEY_DATE, KEY_ID, KEY_FACETS_ALL, KEY_FILTER_TYPE_DETAILS } from '../config'
import { isTooOld, extractDetailsFromBody, buildBodyFromDetails, getRunIds, buildConfigForRequest } from '../../assets/js/utils'
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

      const { region, variable, year } = extractDetailsFromBody(body)

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
    const facets = filter(get(rootState, ['facets', KEY_FACETS_ALL]), { type: KEY_FILTER_TYPE_DETAILS })
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
      const cache = find(state.data, { variable: item.key, year: item.year, region: item.region })
      const lastLoad = get(cache, KEY_DATE, null)
      if (!cache) {
        console.log('Is not in cache')
        console.log(item.key, item.year, item.region, state.data)
      } else if (isTooOld(lastLoad)) {
        console.log('Is too old')
      }
      return !cache || isTooOld(lastLoad)
    })
    // console.log('result:', requests)
    if (requests.length) {
      console.log(`Sending out ${requests.length} requests`)
      dispatch('auth/auth', { follower: { name: 'details/load', params: { requests } }, isForced: false }, { root: true })
    } else {
      console.log('No requests necessary')
    }
  },
  load ({ state, commit, dispatch, rootState }, { requests }) {
    console.log('loaddetails', requests)

    const runs = getRunIds(basket)

    const { url } = state
    const config = buildConfigForRequest(rootState)

    forEach(requests, ({ key, year, region }) => {
      const body = buildBodyFromDetails(runs, year, region, key)
      console.log(year, key, region)
      axios.post(url, body, config)
        .then(response => {
          const { data } = response
          console.log('Loading successfull')
          commit('API_DETAILS', { data, body })
          dispatch('load/mergeWithDetails', { data }, { root: true })
        })
        .catch(error => {
          console.log('Loading failed', { error })
        })
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
