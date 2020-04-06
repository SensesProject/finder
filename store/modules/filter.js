// This module organises the applied filters
// Filter are the dimensions to filter by. Facets are the displayed lists of options
import { get, unset, set, has, forEach, map } from 'lodash'
import { extent } from 'd3-array'
import { scaleLinear, scaleThreshold } from 'd3-scale'
import { getList, makeDict } from '../../assets/js/facets'

// import { reject, clone, find, pull, isUndefined, get, forEach, isArray, set } from 'lodash'
import { RESET_CODE, KEY_FILTER_TYPE_HISTOGRAM, KEY_TOOLTIP, KEY_LABEL, KEY_PATH, KEY_FILTER_TYPE_LIST, KEY_FILTER_TYPE_SEARCH, KEY_DIMENSION, KEY_TYPE, KEY_FILTER, KEY_FILTER_INIT } from '../config'
import { basket } from '../index'
// import { getList } from '../../assets/js/facets'

const state = () => ({
  // filter: [],
  // This hold the filter that are passed by the url
  [KEY_FILTER_INIT]: null,
  // This holds the currently applied filter settings
  [KEY_FILTER]: {} // The filter settings
})

const mutations = {
  CREATE_FACET (state, { key, type, tooltip, label, id, popover }) {
    // This mutation creates a facet by creating a dimension for this key
    // It also sets the type of the facet. This is used later for the filtering technique
    const dimension = basket.dimension((d) => get(d, key, false))
    // Facets need different types of lists of options
    const facet = type === KEY_FILTER_TYPE_LIST ? getList(dimension) : dimension.group()

    const init = makeDict(facet.all())

    state[KEY_FILTER] = {
      ...state[KEY_FILTER],
      [id]: {
        [KEY_PATH]: key,
        [KEY_TOOLTIP]: tooltip,
        [KEY_LABEL]: label,
        [KEY_DIMENSION]: dimension,
        id,
        facet,
        init,
        [KEY_TYPE]: type,
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
    // This mutation removes the dimension
    state[KEY_FILTER][key][KEY_DIMENSION].dispose()
    // It also cleans up the whole filter
    unset(state, [KEY_FILTER, key])
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
      console.log(RESET_CODE)
      filter.forcedValue = RESET_CODE // null triggers a reset
    })
  },
  // RESET_FILTER (state, id) {
  //   // Reset a single filter
  //   state.filter = reject(state.filter, ['id', id])
  // },
  // SET_FILTER (state, { id, value, type, key }) {
  //   // This initiates a filter for one column/key
  //   // The column is filtered by items in values
  //   if (!isUndefined(type) && !isUndefined(id) && !isUndefined(value) && !isUndefined(key)) {
  //     const filter = clone(state.filter)
  //     filter.push({
  //       id,
  //       'values': isArray(value) ? value : [value],
  //       'invert': false,
  //       type,
  //       key
  //     })
  //     state.filter = filter
  //   }
  // },
  // ADD_FILTER (state, { id, value }) {
  //   // This adds a value to an existing filter
  //   const filter = clone(state.filter)
  //   const facet = find(filter, ['id', id])
  //   facet.values.push(value)
  //   state.filter = filter
  // },
  // INVERT_FILTER (state, { id }) {
  //   const filter = clone(state.filter)
  //   const facet = find(filter, ['id', id])
  //   facet.invert = !facet.invert
  //   state.filter = filter
  // },
  // REMOVE_FILTER (state, { id, value }) {
  //   const filter = clone(state.filter)
  //   const facet = find(filter, ['id', id])
  //   pull(facet.values, value)
  //   if (facet.values.length === 0) {
  //     state.filter = reject(state.filter, ['id', id])
  //   } else {
  //     state.filter = filter
  //   }
  // },
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
  updateDimension ({ commit, dispatch, state }) {
    // console.log('updateDimension')
    forEach(state[KEY_FILTER], ({ type, facet, dimension, [KEY_PATH]: path }, key) => {
      if (type === KEY_FILTER_TYPE_HISTOGRAM) {
        // console.log(dimension, facet)
        const values = map(dimension.top(Infinity), (d) => get(d, path))
        // console.log({values})
        const domain = extent(values)
        const scale = scaleLinear().domain(domain).nice()
        const thresholds = scale.ticks(40)
        const bin = scaleThreshold().domain(thresholds).range(thresholds)
        // console.log(1, '->', bin(1), 100, '->', bin(100), 200, '->', bin(200), 1000, '->', bin(1000))
        state[KEY_FILTER][key].facet = dimension.group((d) => bin(d))// .reduce(...customReducer())
        state[KEY_FILTER][key].thresholds = thresholds
        // console.log(state[KEY_FILTER][key].facet.top(Infinity))
      }
      state[KEY_FILTER][key].init = makeDict(state[KEY_FILTER][key].facet.all())
    })
  },
  addFacet ({ commit, dispatch }, options) {
    console.log('filter/addFacet', options)
    // This function is called for each visible facet
    // Options look like this { key: 'category', type: 'list' }
    commit('CREATE_FACET', options)
    dispatch('apply')
  },
  removeFacet ({ commit, dispatch }, key) {
    // This function is called when a facet becomes invisible (is set hidden by the user)
    console.log('filter/removeFacet', key)
    commit('REMOVE_FACET', key)
    dispatch('apply')
  },
  resetFilter ({ commit, dispatch }, key) {
    // This function is called when a filter is resetted by the user
    console.log('filter/resetFilter', key)
    commit('RESET_FACET', key)
    dispatch('apply')
  },
  filter ({ commit, dispatch }, options) {
    // console.log('filter/filter')
    // This function actually applies a filter in a dimension. It is called by the Facets
    // console.log('filter', options)
    commit('APPLY_FILTER', options)
    dispatch('apply')
  },
  // OLD ACTIONS
  resetFilters ({ commit }) {
    console.log('filter/resetFilters')
    commit('RESET_FILTERS')
  },
  // resetFilter ({ commit }, id) {
  //   // console.log('resetFilter')
  //   commit('RESET_FILTER', id)
  // },
  // setFilter ({ commit, rootState }, { id, value }) {
  //   const facets = get(rootState, ['facets', 'facets'])
  //   const facet = find(facets, { id })
  //   const type = get(TYPES, get(facet, 'type')) // The type of the filter (range, key-value, term)
  //   const key = get(facet, 'key') // The »address« of the value
  //   if (!isUndefined(type) && !isUndefined(id) && !isUndefined(value) && !isUndefined(key)) {
  //     commit('RESET_FILTER', id)
  //     commit('SET_FILTER', { id, value, type, key })
  //   }
  // },
  // addFilter ({ commit }, { id, value }) {
  //   // console.log('addFilter', id, value)
  //   commit('ADD_FILTER', { id, value })
  // },
  // removeFilter ({ commit }, { id, value }) {
  //   // console.log('removeFilter', id, value)
  //   commit('REMOVE_FILTER', { id, value })
  // },
  // invertFilter ({ commit }, id) {
  //   // console.log('invertFilter', id)
  //   commit('INVERT_FILTER', { id })
  // },
  setInitFilter ({ commit }, initFilter) {
    console.log('filter/setInitFilter', initFilter)
    commit('SET_INIT_FILTER', initFilter)
  },
  initFilter ({ dispatch, commit, state }) {
    console.log('filter/initFilter')
    // TODO
    forEach(state.initFilter, (value, key) => {
      // TODO: Create filter if not present. Make visible if invisible
      const filter = get(state[KEY_FILTER], key)
      if (filter) {
        filter.forcedValue = {
          value: value.split('|')
        }
        console.log(`Filter ${key} set to ${value.split('|')}`)
        console.log({ filter })
      } else {
        console.log(`Filter ${key} not found`)
      }
    })
    // Reset state.initFilter to null
    commit('SET_INIT_FILTER', null)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
