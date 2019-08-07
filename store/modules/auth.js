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
  date: false
})

const mutations = {
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
  auth ({ state, commit, dispatch }, { isForced, follower }) {
    // This method is called in two cases
    // 1. The website is called brand new without a token in local storage
    // 2. The method is called by force to get a new token
    // Parameters can be a function that is called afterwards
    console.log('Action: Auth')
    if (isForced || state.token === false) {
      const url = 'https://db1.ene.iiasa.ac.at/EneAuth/config/v1/anonym/IXSE_SR15'
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
      dispatch('callFollower', { follower })
    }
  },
  callFollower ({ dispatch }, { follower, isForced }) {
    if (isObject(follower)) {
      const { name, params } = follower
      dispatch(name, { ...params, isLoop: isForced, isForced }) // isLoop prevents a loop of calling the target in a loop
    }
  }
}

export default {
  state,
  mutations,
  actions
}
