import axios from 'axios'
import { get, replace, forEach, startsWith, isUndefined, map, set, keys } from 'lodash'
import { format } from 'timeago.js'
import { STATUS_IDLE, STATUS_LOADING, STATUS_LOADING_FAILED, STATUS_LOADING_SUCCESS } from '../config'
import { isTooOld } from '../../assets/js/utils'

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
    state.status = status
    if (!isUndefined(message)) {
      state.message = message
    }
    if (!isUndefined(data)) {
      state.data = data
      // Safe the current date to get its age the next time
      state.date = new Date()
    }
  }
}

function extractFromGoogleTable (data) {
  return map(get(data, ['feed', 'entry']), entry => {
    const obj = {}
    forEach(keys(entry), key => {
      if (startsWith(key, 'gsx$')) {
        const path = replace(key, 'gsx$', '')
        let value = get(entry, [key, '$t'])
        switch (value) {
          case 'TRUE':
            value = true
            break
          case 'FALSE':
            value = false
            break
        }
        set(obj, path, value)
      }
    })
    return obj
  })
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
    console.log('Action: Check data', { isForced })
    const lastLoad = get(state, 'date', false)
    // Is the last loading time longer ago than one day ago or has been loaded before at all
    const shouldReload = !lastLoad || isTooOld(lastLoad)
    // If longer ago or forced (on hard reload)
    const willReload = shouldReload ? true : isForced
    if (willReload) {
      console.log('Data is too old or reload is forced. Will reload data')
    }
    // The authorization is called in any case but with varying parameter. The follower is the function called afterwards
    dispatch('auth', { follower: { name: 'load' }, isForced: willReload })
  },
  load ({ state, commit, dispatch, rootState }, { isForced, isLoop }) {
    // This function is called after authorization
    // This is the actual function to load data
    console.log('Action: Load data', { isForced })
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
      console.log('Load Request send')
      axios.get(url, config)
        .then(response => {
          const { data } = response
          console.log('Loading successfull')
          // Check were data is coming from
          const datum = state.isGoogleSheet ? extractFromGoogleTable(data) : data
          commit('API_DATA', { status: STATUS_LOADING_SUCCESS, data: datum })
        })
        .catch(error => {
          console.log('Loading failed', { error, isLoop })
          commit('API_DATA', { status: STATUS_LOADING_FAILED, message: error })
          if (!isLoop) {
            console.log('Trying to relogin')
            dispatch('auth', { follower: { name: 'load' }, isForced: true })
          }
        })
    } else {
      console.log('Data already loaded', format(state.date))
      commit('API_DATA', { status: STATUS_LOADING_SUCCESS })
    }
  }
}

export default {
  state,
  mutations,
  actions
}
