import axios from 'axios'
import { get, isUndefined, map, fromPairs, round, countBy, flatten, indexOf, lowerCase, intersection, isArray } from 'lodash'

const STATUS_IDLE = 'IDLE'

const STATUS_AUTH = 'AUTH'
const STATUS_AUTH_FAILED = 'AUTH_FAILED'
const STATUS_AUTH_SUCCESS = 'AUTH_SUCCESS'

const STATUS_LOADING = 'LOADING'
const STATUS_LOADING_FAILED = 'LOADING_FAILED'
const STATUS_LOADING_SUCCESS = 'LOADING_SUCCESS'

const state = {
  data: [],
  token: false,
  status: STATUS_IDLE,
  message: false
}

const getters = {
  datum: (state, getters, rootState) => {
    return map(state.data, datum => {
      // Rebuild the data structure. Build an object from the data array
      return fromPairs(map(rootState.facets, facet => {
        const key = facet.key
        const value = get(datum, facet.key, '—')
        let label
        if (facet.type === 'category') {
          label = value
            .replace(/[_-]/g, ' ')
            .replace(/1p5/g, '1.5')
        } else if (facet.type === 'number') {
          label = round(value, facet.precision)
        }
        const obj = {
          key,
          value,
          label,
          hasPopover: !isUndefined(facet.hasPopover)
        }
        return [facet.key, obj]
      }))
    })
  },
  options: (state, getters, rootState) => {
    const facets = rootState.facets
    return facets.map(facet => {
      const { key } = facet
      // Count all options for that facet (respectively key)
      const options = countBy(flatten(getters.datum.map(item => {
        return item[key].label
      })))
      return {
        ...facet,
        options
      }
    })
  },
  process: state => {
    return countBy(state.data.map(item => item['process']))
  },
  result: (state, getters, rootState) => {
    let result = getters.datum
    rootState.filter.forEach(filta => {
      result = result.filter(item => {
        // console.log(filta.key, item[filta.key], filta.values, indexOf(filta.values, item[filta.key]))
        let retVal = true
        if (indexOf(getters.titles, filta.key) > -1) { // Facet is search term
          retVal = lowerCase(item[filta.key].label).includes(lowerCase(filta.values))
        } else {
          if (isArray(item[filta.key])) { // TODO: Does this ever happen?
            retVal = intersection(item[filta.key].label, filta.values).length > 0
          } else {
            retVal = indexOf(filta.values, item[filta.key].label) > -1
          }
        }

        return filta.invert ? !retVal : retVal
      })
    })
    return result
  },
  counter: (state, getters, rootState) => {
    const values = rootState.facets.map(facet => {
      const { key } = facet
      const options = countBy(flatten(getters.result.map(item => item[key].label)))
      return [key, options]
    })
    return fromPairs(values)
  }
}

const mutations = {
  API_DATA (state, { status, token, message, data }) {
    state.status = status
    if (!isUndefined(token)) {
      state.token = token
    }
    if (!isUndefined(message)) {
      state.message = message
    }
    if (!isUndefined(data)) {
      state.data = data
    }
  }
}

const actions = {
  loadData ({ dispatch }) {
    dispatch('auth')
  },
  auth ({ state, commit, dispatch }, isForced = false) {
    if (isForced && (state.status === STATUS_IDLE || state.token === false)) {
      commit('API_DATA', { status: STATUS_AUTH })
      const url = 'https://db1.ene.iiasa.ac.at/EneAuth/config/v1/anonym/IXSE_SR15'
      console.log('Auth Request send')
      axios.get(url)
        .then(response => {
          const { data } = response
          console.log('Auth success')
          commit('API_DATA', { status: STATUS_AUTH_SUCCESS, token: data })
          dispatch('load')
        })
        .catch(error => {
          console.log('Auth failed')
          commit('API_DATA', { status: STATUS_AUTH_FAILED, message: error })
        })
    } else {
      console.log('Already logged in')
      dispatch('load')
    }
  },
  load ({ state, commit }, isForced = false) {
    if (isForced && (state.status !== STATUS_LOADING && ((state.status !== STATUS_AUTH_SUCCESS && state.status !== STATUS_LOADING_FAILED) || (state.status === STATUS_AUTH_SUCCESS && state.data.length === 0)))) {
      commit('API_DATA', { status: STATUS_LOADING })
      const url = 'https://db1.ene.iiasa.ac.at/iamc15-api/rest/v2.1/runs?getOnlyDefaultRuns=false&includeMetadata=true'
      const config = {
        headers: { 'Authorization': `Bearer ${state.token}` }
      }
      console.log('Load Request send')
      axios.get(url, config)
        .then(response => {
          const { data } = response
          commit('API_DATA', { status: STATUS_LOADING_SUCCESS, data: data })
        })
        .catch(error => {
          commit('API_DATA', { status: STATUS_LOADING_FAILED, message: error })
        })
    } else {
      console.log('Data already loaded')
    }
  }
}

export default {
  state,
  getters,
  mutations,
  actions
}
