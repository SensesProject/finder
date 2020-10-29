// This module is for authentication.

import axios from 'axios'
import { isUndefined, isObject, get } from 'lodash'
import { format } from 'timeago.js'
import { KEY_DATE, STATUS_IDLE, STATUS_AUTH, STATUS_AUTH_FAILED, STATUS_AUTH_SUCCESS } from '../config'

const state = () => ({
  token: false, // This hold the authentication token
  status: STATUS_IDLE,
  message: false,
  // date: false,
  url: false // This holds the url for authentication
})

const mutations = {
  SET_URL_AUTH (state, url) {
    state.url = url
  },
  API_AUTH (state, { status, token, message }) {
    if (!isUndefined(status)) {
      state.status = status
    }
    if (!isUndefined(token)) {
      state.token = token
      // state.date = new Date()
    }
    if (!isUndefined(message)) {
      state.message = message
    }
  }
}

const actions = {
  setUrlAuth ({ commit }, url) {
    // This function is called by the Finder module, when the Finder is intialised
    commit('SET_URL_AUTH', url)
  },
  auth ({ state, commit, dispatch }, { isForced, follower }) {
    // This method is called every time the Finder is loaded. The isForced may vary
    // It is true if:
    // 1. The website is called brand new without a token in local storage
    // 2. The method is called by force to get a new token
    // Follower is a function that is called afterwards
    // console.log('Action: Auth', { isForced })
    if ((isForced || state.token === false) && state.url) {
      const url = state.url
      console.log('Auth Request send')
      commit('API_AUTH', { status: STATUS_AUTH })
      axios.get(url)
        .then(response => {
          const { data } = response
          console.log('Auth success', data)
          commit('API_AUTH', { status: STATUS_AUTH_SUCCESS, token: data })
          dispatch('callFollower', { follower, isForced })
        })
        .catch(error => {
          console.log('Auth failed')
          commit('API_AUTH', { status: STATUS_AUTH_FAILED, message: error })
        })
    } else {
      console.log('Already logged in', format(get(state, KEY_DATE, null)))
      dispatch('callFollower', { follower, isForced })
    }
  },
  callFollower ({ dispatch }, { follower, isForced }) {
    // This function is called afterwards
    if (isObject(follower)) {
      const { name, params } = follower
      // Exctract possible params (TODO: Check if actually happening. Not sure anymore)
      // isLoop prevents a loop of calling the target in a loop. (TODO: Explain how)
      dispatch(name, { ...params, isLoop: isForced, isForced }, { root: true })
    }
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
