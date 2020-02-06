import axios from 'axios'
import { includes, compact, get, isUndefined, map, fromPairs, round, countBy, flatten, indexOf, lowerCase, inRange, set } from 'lodash'
import { format } from 'timeago.js'

const STATUS_IDLE = 'IDLE'

const STATUS_LOADING = 'LOADING'
const STATUS_LOADING_FAILED = 'LOADING_FAILED'
const STATUS_LOADING_SUCCESS = 'LOADING_SUCCESS'

const state = () => ({
  data: [],
  status: STATUS_IDLE,
  message: false,
  date: false,
  url: false
})

const getters = {
  datum: (state, getters, rootState) => {
    const facets = get(rootState, 'facets.facets', [])
    return map(state.data, datum => {
      // Rebuild the data structure. Build an object from the data array
      return fromPairs(map(facets, facet => {
        const key = facet.key
        const values = get(datum, key, false)
        // console.log(values, facet.key, datum)
        let label = values
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

        const lower = lowerCase(label)

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
          lower,
          popover,
          popoverID,
          popoverKey
        }
        return [facet.key, obj]
      }))
    })
  },
  options: (state, getters, rootState) => {
    const facets = get(rootState, 'facets.facets', [])
    const visibleFacets = rootState.facets.visibleFacets

    return compact(facets.map(facet => {
      if (!includes(visibleFacets, facet.key)) {
        return false
      }

      const { key } = facet
      // Count all options for that facet (respectively key)
      const options = countBy(getters.datum.map(item => {
        return get(item, [key, 'label'])
      }))
      const values = compact(getters.datum.map(item => {
        return get(item, [key, 'values'])
      }))
      return {
        ...facet,
        options,
        values
      }
    }))
  },
  process: state => {
    return countBy(state.data.map(item => item['process']))
  },
  result: (state, getters, rootState) => {
    let result = getters.datum
    const filter = get(rootState, 'filter.filter', [])
    filter.forEach(filta => {
      // Prepare filter options before loop
      const low = get(filta, 'values[0].low', -Infinity)
      const high = get(filta, 'values[0].high', Infinity)
      // Prepare term before loop
      let term
      if (filta.type === 'term') {
        term = lowerCase(filta.values)
      }
      result = result.filter(item => {
        let retVal = true
        if (filta.type === 'term') { // Facet is search term
          retVal = item[filta.key].lower.includes(term)
        } else if (filta.type === 'key-value') {
          const label = get(item[filta.key], 'label')
          retVal = label ? indexOf(filta.values, label) > -1 : true
        } else if (filta.type === 'range') {
          // TODO: Does not include end
          retVal = inRange(item[filta.key].label, low, high)
        }
        return filta.invert ? !retVal : retVal
      })
    })
    return result
  },
  counter: (state, getters, rootState) => {
    const facets = get(rootState, 'facets.facets', [])
    const values = facets.map(facet => {
      const { key } = facet
      const options = countBy(flatten(getters.result.map(item => item[key].label)))
      return [key, options]
    })
    return fromPairs(values)
  }
}

const mutations = {
  SET_URL_DATA (state, url) {
    state.url = url
  },
  API_DATA (state, { status, message, data }) {
    state.status = status
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
  setUrlData ({ commit }, url) {
    commit('SET_URL_DATA', url)
  },
  loadData ({ state, dispatch }, isForced = false) {
    console.log('Action: Check data', { isForced })
    const ONE_DAY = 60 * 60 * 1000 * 24
    const lastLoad = get(state, 'date', false)
    const shouldReload = !lastLoad || ((new Date()) - new Date(lastLoad)) > ONE_DAY
    const willReload = shouldReload ? true : isForced
    if (willReload) {
      console.log('Data is too old or reload is forced. Will reload data')
    }
    dispatch('auth', { follower: { name: 'load' }, isForced: willReload })
  },
  load ({ state, commit, dispatch, rootState }, { isForced, isLoop }) {
    console.log('Action: Load data', { isForced })
    if (isForced) {
      commit('API_DATA', { status: STATUS_LOADING, data: [] })
    }
    if (isForced || (state.status !== STATUS_LOADING && state.data.length === 0)) {
      commit('API_DATA', { status: STATUS_LOADING })
      const url = state.url
      const config = {}
      if (rootState.auth.url) {
        set(config, 'headers.Authorization', `Bearer ${rootState.auth.token}`)
      }
      console.log('Load Request send')
      axios.get(url, config)
        .then(response => {
          const { data } = response
          console.log('Loading successfull')
          console.log(data)
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
      console.log('Data already loaded', format(state.date))
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
