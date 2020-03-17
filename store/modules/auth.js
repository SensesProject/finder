import axios from 'axios'
import { isUndefined, isObject } from 'lodash'
import { format } from 'timeago.js'

const STATUS_IDLE = 'IDLE'

const STATUS_AUTH = 'AUTH'
const STATUS_AUTH_FAILED = 'AUTH_FAILED'
const STATUS_AUTH_SUCCESS = 'AUTH_SUCCESS'

const state = () => ({
  token: false,
  status: STATUS_IDLE,
  message: false,
  date: false,
  url: false
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
      state.date = new Date()
    }
    if (!isUndefined(message)) {
      state.message = message
    }
  }
}

const actions = {
  setUrlAuth ({ commit }, url) {
    commit('SET_URL_AUTH', url)
  },
  auth ({ state, commit, dispatch }, { isForced, follower }) {
    // This method is called every time the Finder is loaded. The isForced may vary
    // It is true if:
    // 1. The website is called brand new without a token in local storage
    // 2. The method is called by force to get a new token
    // Follower is a function that is called afterwards
    console.log('Action: Auth', { isForced })
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
      console.log('Already logged in', format(state.date))
      dispatch('callFollower', { follower, isForced })
    }
  },
  callFollower ({ dispatch }, { follower, isForced }) {
    // This function is called afterwards
    if (isObject(follower)) {
      const { name, params } = follower
      // Exctract possible params (TODO: Check if actually happening. Not sure anymore)
      // isLoop prevents a loop of calling the target in a loop. (TODO: Explain how)
      dispatch(name, { ...params, isLoop: isForced, isForced })
    }
  }
}

export default {
  state,
  mutations,
  actions
}
