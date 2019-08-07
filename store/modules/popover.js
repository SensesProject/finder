import axios from 'axios'
import { isUndefined, get } from 'lodash'

const STATUS_IDLE = 'IDLE'

const STATUS_LOADING = 'LOADING'
const STATUS_LOADING_FAILED = 'LOADING_FAILED'
const STATUS_LOADING_SUCCESS = 'LOADING_SUCCESS'

const state = {
  popover: false,
  status: STATUS_IDLE,
  content: false
}

const mutations = {
  CLOSE_POPOVER (state) {
    state.popover = false
  },
  OPEN_POPOVER (state, { id, content }) {
    state.popover = id
    if (!isUndefined(content)) {
      state.content = content
    }
  }
}

const actions = {
  closePopover ({ commit }) {
    commit('CLOSE_POPOVER')
  },
  openInfoBox ({ commit }) {
    commit('OPEN_POPOVER', { status: STATUS_LOADING_SUCCESS, content: 'reference', id: 'info' })
  },
  openPopover ({ getters, commit, rootState, dispatch }, obj) {
    const { popover: url, popoverKey: key, isLoop } = obj
    let { popoverID: id } = obj
    const token = get(rootState, 'auth.token', false)
    const headers = {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
    const data = {
      'keys': [`/${key}/${id}`]
    }
    commit('OPEN_POPOVER', { status: STATUS_LOADING })
    axios({ method: 'POST', url, data: data, headers })
      .then(response => {
        let content = get(response, 'data.[0].description', false)
        if (!content) {
          content = `Nothing found for ${obj.label}`
          id = obj.value
        }
        commit('OPEN_POPOVER', { status: STATUS_LOADING_SUCCESS, content, id })
      })
      .catch(error => {
        console.log('Popover failed', { error })
        if (!isLoop && error.response.status === 401) {
          dispatch('auth', { isForced: true, follower: { name: 'openPopover', params: obj } })
        } else {
          commit('OPEN_POPOVER', { status: STATUS_LOADING_FAILED })
        }
      })
  }
}

export default {
  state,
  mutations,
  actions
}
