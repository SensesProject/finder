// This module handles detail requests. For the scenario database, some fields allow the user to request more data
import axios from 'axios'
import { assign, get, isUndefined, set, filter, map, forEach, find } from 'lodash'
import { format } from 'timeago.js'
import { KEY_STATUS, STATUS_IDLE, STATUS_LOADING, STATUS_LOADING_FAILED, STATUS_LOADING_SUCCESS, STATUS_EMPTY, KEY_DATE, KEY_ID, KEY_FACETS_ALL, KEY_FILTER_TYPE_DETAILS } from '../config'
import { isTooOld, extractDetailsFromBody, buildBodyFromDetails, getRunIds, buildConfigForRequest, detailPath } from '../../assets/js/utils'
import { basket } from '../index'

const state = () => ({
  data: {},
  url: false
})

const mutations = {
  SET_URL_DETAILS (state, url) {
    state.url = url
  },
  API_DETAILS (state, { data, body, message }) {
    const { region, variable, year } = extractDetailsFromBody(body)
    // console.log('API_DETAILS', message)

    if (message === STATUS_LOADING_FAILED || message === STATUS_LOADING) {
      state.data = assign(
        {},
        state.data,
        {
          [detailPath(variable, year, region)]: {
            [KEY_DATE]: new Date(),
            [KEY_STATUS]: message
          }
        }
      )
    } else { // If the message is sucess
      // This function is called, when we get new data
      if (!isUndefined(data) && data.length) {
        // Check if data is being passed and has length
        // This is false if no data is available

        // console.log(`Got data with ${data.length} elements`)
        // First, we extract the information from the request to correctly place it in the state

        if (region && variable && year) {
          detailPath(variable, year, region)
          state.data = assign(
            {},
            state.data,
            {
              [detailPath(variable, year, region)]: {
                [KEY_DATE]: new Date(),
                [KEY_STATUS]: STATUS_LOADING_SUCCESS,
                data
                // region,
                // variable,
                // year
              }
            }
          )
        }
      } else { // If no new data was coming in
        state.data = assign(
          {},
          state.data,
          {
            [detailPath(variable, year, region)]: {
              [KEY_DATE]: new Date(),
              [KEY_STATUS]: STATUS_EMPTY
            }
          }
        )
      }
    }
  },
  FILTER_OLD_DATA (state) {
    // TODO: Not used yet
    // This function could be used to call at the very beginning to clear out old data
    state.data = filter(state.data, (datum) => {
      return !isTooOld(get(datum, KEY_DATE))
    })
  }
}

const actions = {
  setUrlDetails ({ commit }, url) {
    commit('SET_URL_DETAILS', url)
  },
  initDetails ({ state, dispatch, rootState }, isForced = false) {
    const facets = filter(get(rootState, ['facets', KEY_FACETS_ALL]), { type: KEY_FILTER_TYPE_DETAILS, visible: true })
    console.log('initDetails', facets.length)
    dispatch('loadDetails', { list: facets, isForced })
  },
  // This starts the loading process. It is triggered by the localStorage or on hard reload
  // This only checks how old the current data from the local storage is
  loadDetails ({ state, dispatch, rootState, commit }, payload) {
    const list = get(payload, 'list', [])
    const isForced = get(payload, 'isForced', false)
    // console.log('load Details', list, isForced)
    const requests = isForced ? list : filter(list, ({ key, year, region }) => {
      // console.log({ key }, detailPath(key, year, region))
      const cache = get(state.data, detailPath(key, year, region))
      // const cache = find(state.data, { variable: key, year: year, region: region })
      const lastLoad = get(cache, KEY_DATE, null)
      const hasFailed = get(cache, KEY_STATUS) === STATUS_LOADING_FAILED || get(cache, KEY_STATUS) === STATUS_EMPTY
      if (!cache) {
        console.log(`${key} is not in cache`)
        // console.log(key, year, region, hasFailed)
      } else if (isTooOld(lastLoad)) {
        console.log('Is too old')
      }
      return !cache || isTooOld(lastLoad)
    })
    // console.log('result:', requests)
    if (requests.length) {
      // console.log(`Sending out ${requests.length} requests`)
      dispatch('auth/auth', { follower: { name: 'details/load', params: { requests } }, isForced: false }, { root: true })
    } else {
      // console.log('No request necessary')
      // commit('API_DETAILS', { message: STATUS_LOADING_SUCCESS })
      dispatch('filter/updateDimensions', false, { root: true })
    }
  },
  load ({ state, commit, dispatch, rootState }, { requests }) {
    // console.log('loaddetails', requests)

    if (requests.length) {
      // For now, we need to reset all the filters because Crossfilter cannot remove just all the data
      // It can only delete the data that is currently filtered. So in order to remove really all the data we need to delete all current filter.
      // One idea to fix that would be to store the current filter in the init filters just like the url parameters
      dispatch('filter/setCurrentAsInitFilter', false, { root: true })
      dispatch('filter/resetFilters', false, { root: true })
      // setCurrentAsInitFilter
      console.log('resetFilters in details’ load')

      const runs = getRunIds(basket)

      const { url } = state
      const config = buildConfigForRequest(rootState)

      forEach(requests, ({ key, year, region }) => {
        const body = buildBodyFromDetails(runs, year, region, key)
        // console.log(year, key, region)
        commit('API_DETAILS', { body, message: STATUS_LOADING })
        axios.post(url, body, config)
          .then(response => {
            const { data } = response
            // console.log('Loading successfull')
            commit('API_DETAILS', { data, body, message: STATUS_LOADING_SUCCESS })
            // console.log('details -> mergeWithDetails')
            dispatch('load/mergeWithDetails', { data }, { root: true })
          })
          .catch(error => {
            commit('API_DETAILS', { body, message: STATUS_LOADING_FAILED })
            console.log('Loading failed', { error, body, config })
          })
          .then(() => {
            dispatch('filter/initFilter', false, { root: true })
          })
      })
    }
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
