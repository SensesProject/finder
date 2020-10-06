// This module organises the applied filters
// Filter are the dimensions to filter by. Facets are the displayed lists of options
import { get, unset, set, has, forEach, map, keys, difference, find } from 'lodash'
import { getList, makeDict } from '../../assets/js/facets'
import { KEY_FACETS_ALL, RESET_CODE, KEY_FILTER_TYPE_HISTOGRAM, KEY_TOOLTIP, KEY_LABEL, KEY_PATH, KEY_FILTER_TYPE_LIST, KEY_FILTER_TYPE_SEARCH, KEY_DIMENSION, KEY_TYPE, KEY_FILTER, KEY_FILTER_INIT, KEY_FILTER_TYPE_DETAILS } from '../config'
import { buildPath, buildHistogram } from '../../assets/js/utils'
import { basket } from '../index'

const state = () => ({
  // This holds the filter that are passed by the url
  [KEY_FILTER_INIT]: null,
  // This holds the currently applied filter settings
  [KEY_FILTER]: {}
})

const mutations = {
  CREATE_FACET (state, { key, type, tooltip, label, unit, id, popover, i, group, region, year }) {
    // console.log('CREATE_FACET', id)
    // This mutation creates a facet by creating a dimension for this key
    // console.log({ key, type, label })
    const path = buildPath(type, key, year, region)
    // It also sets the type of the facet. This is used later for the filtering technique
    const dimension = basket.dimension((d) => get(d, path, false))
    // Facets need different types of lists of options
    const facet = type === KEY_FILTER_TYPE_LIST ? getList(dimension) : dimension.group()

    const init = makeDict(facet.all())

    console.log({ id })

    state[KEY_FILTER] = {
      ...state[KEY_FILTER],
      [id]: {
        [KEY_PATH]: path,
        [KEY_TOOLTIP]: tooltip,
        [KEY_LABEL]: label,
        [KEY_DIMENSION]: dimension,
        id,
        i,
        facet,
        init,
        unit,
        group,
        year, // Used for details
        region, // Used for details
        [KEY_TYPE]: type,
        key,
        popover,
        // This is used to pass down settings or for a reset
        forcedValue: undefined,
        // These values are set on change, but a only needed for the url
        value: undefined,
        isInverted: undefined
      }
    }
  },
  APPLY_FILTER (state, { key, value, isInverted }) {
    // This mutation actually filters items along the selected dimension
    // The dimension is selected by the key.
    // Value is the search term, the list of options or a value range
    // IsInverted is only used by some filtering techniques

    // First find out the type of this facet
    const type = get(state, [KEY_FILTER, key, KEY_TYPE])
    // Apply different filtering techniques according to the type
    if (type === KEY_FILTER_TYPE_LIST) {
      if (value.length > 1) {
        // If multiple options are selected in the list
        state[KEY_FILTER][key][KEY_DIMENSION].filter((d) => value.includes(d))
      } else {
        // If only a single option is selected in the list
        state[KEY_FILTER][key][KEY_DIMENSION].filterExact(value[0])
      }
      // Note: For list filtering, we do not care about inverting as this is done by the ListFacet
    } else if (type === KEY_FILTER_TYPE_SEARCH) {
      state[KEY_FILTER][key][KEY_DIMENSION].filter((d) => {
        // Convert the search cell content to uppercase and check if it contains the search term
        const has = d.toUpperCase().includes(value)
        // For the SearchFacet, we need to check if search is inverted or not as this can’t be handled by the Facet
        return isInverted ? !has : has
      })
    } else if (type === KEY_FILTER_TYPE_HISTOGRAM) {
      state[KEY_FILTER][key][KEY_DIMENSION].filterRange(value)
    }
    state[KEY_FILTER][key].value = value
    state[KEY_FILTER][key].isInverted = isInverted
  },
  REMOVE_FACET (state, key) {
    // console.log('REMOVE_FACET', {key})
    // This mutation removes the dimension
    state[KEY_FILTER][key][KEY_DIMENSION].dispose()
    // It also cleans up the whole filter
    const filter = { ...state[KEY_FILTER] }
    delete filter[key]
    state[KEY_FILTER] = filter
    // console.log(state[KEY_FILTER] )
  },
  CHANGE_FACET_YEAR (state, { id, year }) {
    if (has(state, [KEY_FILTER, id])) {
      const type = get(state, [KEY_FILTER, id, KEY_TYPE])
      const region = get(state, [KEY_FILTER, id, 'region'])
      const key = get(state, [KEY_FILTER, id, 'key'])
      state[KEY_FILTER][id]['year'] = year
      const path = buildPath(type, key, year, region)
      state[KEY_FILTER][id][KEY_PATH] = path
      state[KEY_FILTER][id][KEY_DIMENSION].dispose()
      state[KEY_FILTER][id][KEY_DIMENSION] = basket.dimension((d) => get(d, path, false))
      console.log({ id, path, type, region, key, year })
    } else {
      console.log(`Facet for ${id} should be there`)
    }
  },
  RESET_FACET (state, key) {
    // This mutation resets all applyed filtering on this dimension
    if (has(state, [KEY_FILTER, key, KEY_DIMENSION])) {
      state[KEY_FILTER][key][KEY_DIMENSION].filter(null)
    } else {
      console.log(`Dimension for ${key} should be there`, state[KEY_FILTER][key])
    }
  },
  RESET_FILTERS (state) {
    // Resets all filter
    forEach(state[KEY_FILTER], (filter) => {
      // console.log(RESET_CODE)
      filter.forcedValue = RESET_CODE // null triggers a reset
    })
  },
  SET_INIT_FILTER (state, initFilter) {
    set(state, KEY_FILTER_INIT, initFilter)
  }
}

const actions = {
  apply ({ dispatch }) {
    // console.log('filter/apply')
    // This action should be called everytime something changes.
    // It calls the root apply action that triggers filtering and counting
    dispatch('apply', false, { root: true })
  },
  updateDimensions ({ commit, dispatch, state }) {
    // console.log('updateDimensions')
    forEach(state[KEY_FILTER], (filter, key) => {
      dispatch('updateDimension', key)
    })
  },
  updateDimension ({ state }, id) {
    // console.log('updateDimensions')
    // console.log({ id }, state[KEY_FILTER][id], state[KEY_FILTER])
    const { type, facet, dimension, [KEY_PATH]: path } = state[KEY_FILTER][id]
    if (type === KEY_FILTER_TYPE_HISTOGRAM || type === KEY_FILTER_TYPE_DETAILS) {
      // console.log(dimension, facet)
      // const path = type === 'Details' ? `${key}-${2030}-${'World'}` : key
      const values = map(dimension.top(Infinity), (d) => get(d, path))
      // console.log({values})
      const { thresholds, bin } = buildHistogram(values)
      // console.log(1, '->', bin(1), 100, '->', bin(100), 200, '->', bin(200), 1000, '->', bin(1000))
      state[KEY_FILTER][id].facet = dimension.group((d) => bin(d))// .reduce(...customReducer())
      state[KEY_FILTER][id].thresholds = thresholds
      // console.log(state[KEY_FILTER][id].facet.top(Infinity))
    }
    state[KEY_FILTER][id].init = makeDict(state[KEY_FILTER][id].facet.all())
  },
  addFacet ({ commit, dispatch }, options) {
    // console.log('filter/addFacet', options)
    // This function is called for each visible facet
    // Options look like this { key: 'category', type: 'list' }
    commit('CREATE_FACET', options)
    // console.log({ options })
    const { id } = options
    dispatch('updateDimension', id)
    dispatch('apply')
  },
  removeFacet ({ commit, dispatch }, key) {
    // This function is called when a facet becomes invisible (is set hidden by the user)
    // console.log('filter/removeFacet', key)
    commit('REMOVE_FACET', key)
    dispatch('apply')
  },
  resetFilter ({ commit, dispatch }, key) {
    // This function is called when a filter is resetted by the user
    // console.log('filter/resetFilter', key)
    commit('RESET_FACET', key)
    dispatch('apply')
  },
  changeFilterYear ({ commit, dispatch, state }, { id, year }) {
    console.log('changeFilterYear', id, year)
    commit('CHANGE_FACET_YEAR', { id, year })
    const region = get(state, [KEY_FILTER, id, 'region'])
    const key = get(state, [KEY_FILTER, id, 'key'])
    console.log({ region })
    dispatch('apply')
    dispatch('details/loadDetails', { list: [{ key, year, region }]}, { root: true })
  },
  filter ({ commit, dispatch }, options) {
    // console.log('filter/filter')
    // This function actually applies a filter in a dimension. It is called by the Facets
    // console.log('filter', options)
    commit('APPLY_FILTER', options)
    dispatch('apply')
  },
  resetFilters ({ commit }) {
    // console.log('filter/resetFilters')
    commit('RESET_FILTERS')
  },
  checkVisibleFacetList ({ dispatch, state, rootState }, next) {
    // console.log('filter/checkVisibleFacetList')
    const current = keys(state[KEY_FILTER])
    forEach(difference(next, current), (add) => {
      const facet = find(get(rootState, ['facets', KEY_FACETS_ALL]), { id: add })
      dispatch('addFacet', facet)
      // commit('CREATE_FACET', { facet })
    })
    forEach(difference(current, next), (remove) => {
      dispatch('removeFacet', remove)
    })
    dispatch('facets/filter', null, { root: true })
    // })
  },
  setInitFilter ({ commit }, initFilter) {
    // This function is called by the Finder component when the application starts
    // It just saves the filters passed by the url to the state
    // console.log('filter/setInitFilter', initFilter)
    commit('SET_INIT_FILTER', initFilter)
  },
  initFilter ({ dispatch, commit, state, rootState }) {
    // This function is called by the facet module after the facet information is loaded
    // This function loops over the filter that were passed by the url (init filter) and applies them
    // console.log('filter/initFilter')
    forEach(get(state, KEY_FILTER_INIT, []), (value, key) => {
      // TODO: Create filter if not present. Make visible if invisible
      let filter = get(state[KEY_FILTER], key)
      if (!filter) {
        console.log(`Filter ${key} not found. Will create it.`)
        const facet = find(get(rootState, ['facets', KEY_FACETS_ALL]), { id: key })
        if (facet) {
          dispatch('filter/addFacet', facet, { root: true })
        } else {
          console.log(`Could not create filter ${key}. Facet not found.`)
        }
      }
      filter = get(state[KEY_FILTER], key)
      if (filter) {
        const values = value.split('|')
        filter.forcedValue = {
          value: values
        }
        console.log(`Filter ${key} found and applied with values ${values}.`)
      } else {
        console.log(`Filter ${key} not found.`)
      }
    })
    // Reset state.initFilter to null
    commit('SET_INIT_FILTER', null)
    dispatch('facets/filter', null, { root: true })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
