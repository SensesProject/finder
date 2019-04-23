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

// const getters = {
//   popoverOptions: (state, getters, rootState) => {
//     const facets = filter(rootState.facets, 'popover')
//     return fromPairs(map(facets, facet => {
//       return [facet.key, facet.popover]
//     }))
//   }
// }

const mutations = {
  CLOSE_POPOVER (state) {
    state.popover = false
  },
  OPEN_POPOVER (state, { id, content }) {
    state.popover = id
    if (!isUndefined(content)) {
      state.content = get(content, '[0].description', false)
    }
  }
}

const actions = {
  closePopover ({ commit }) {
    commit('CLOSE_POPOVER')
  },
  openPopover ({ getters, commit, rootState, dispatch }, obj) {
    console.log('openPopover', obj, state)
    const { popover: url, popoverID: id, popoverKey: key, isLoop } = obj
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
        const { data } = response
        console.log('Popover success')
        console.log(data, response)
        commit('OPEN_POPOVER', { status: STATUS_LOADING_SUCCESS, content: data, id })
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
