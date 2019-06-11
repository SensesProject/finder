import axios from 'axios'
import { compact, get, isUndefined, map, fromPairs, round, countBy, flatten, indexOf, lowerCase, intersection, isArray } from 'lodash'

const STATUS_IDLE = 'IDLE'

const STATUS_LOADING = 'LOADING'
const STATUS_LOADING_FAILED = 'LOADING_FAILED'
const STATUS_LOADING_SUCCESS = 'LOADING_SUCCESS'

const state = {
  data: [],
  status: STATUS_IDLE,
  message: false,
  date: false
}

const getters = {
  datum: (state, getters, rootState) => {
    return map(state.data, datum => {
      // Rebuild the data structure. Build an object from the data array
      return fromPairs(map(rootState.facets, facet => {
        const key = facet.key
        const values = map(key, k => {
          return get(datum, k, false)
        })
        // console.log(values, facet.key, datum)
        let label = values[0]
        if (facet.type === 'Facet' || facet.type === 'Search') {
          if (!label) {
            label = '—'
          } else {
            label = label
              .replace(/[_-]/g, ' ')
              .replace(/1p5/g, '1.5')
          }
        } else if (facet.type === 'Histogram' || facet.type === 'Scatterplot') {
          label = round(label, facet.precision || 0)
        }

        const popover = get(facet, 'popover.url', false) // Checks if column has a popover
        let popoverID // ID used for the url to request information displayed in popover
        let popoverKey
        if (popover) {
          const path = get(facet, 'popover.path', false)
          popoverID = get(datum, path, false)
          popoverKey = get(facet, 'popover.key', false)
        }

        const obj = {
          key,
          values,
          label,
          popover,
          popoverID,
          popoverKey
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
      const values = compact(getters.datum.map(item => {
        return item[key].values
      }))
      return {
        ...facet,
        options,
        values
      }
    })
  },
  process: state => {
    return countBy(state.data.map(item => item['process']))
  },
  result: (state, getters, rootState) => {
    let result = getters.datum
    const filter = get(rootState, 'facet.filter', [])
    filter.forEach(filta => {
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
      state.date = new Date()
    }
  }
}

const actions = {
  loadData ({ dispatch }, isForced = false) {
    dispatch('auth', { follower: { name: 'load' }, isForced })
  },
  load ({ state, commit, dispatch, rootState }, { isForced, isLoop }) {
    console.log(state.status, state.data.length)
    if (isForced || (state.status !== STATUS_LOADING && state.data.length === 0)) {
      commit('API_DATA', { status: STATUS_LOADING })
      const url = 'https://db1.ene.iiasa.ac.at/iamc15-api/rest/v2.1/runs?getOnlyDefaultRuns=false&includeMetadata=true'
      const config = {
        headers: { 'Authorization': `Bearer ${rootState.auth.token}` }
      }
      console.log('Load Request send')
      axios.get(url, config)
        .then(response => {
          const { data } = response
          console.log('Loading successfull')
          commit('API_DATA', { status: STATUS_LOADING_SUCCESS, data: data })
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
      console.log('Data already loaded')
      commit('API_DATA', { status: STATUS_LOADING_SUCCESS })
    }
  }
}

export default {
  state,
  getters,
  mutations,
  actions
}
