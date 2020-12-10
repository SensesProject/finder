// This module organises the applied filters
// Filter are the dimensions to filter by. Facets are the displayed lists of options
import { groupBy, isUndefined, get, unset, set, has, forEach, map, keys, difference, find, deburr, trim, uniqueId } from 'lodash'
import { getList, makeDict } from '../../assets/js/facets'
import { KEY_ID, KEY_UNIQ_ID, KEY_INIT, KEY_FACETS_ALL, RESET_CODE, KEY_FILTER_TYPE_HISTOGRAM, KEY_TOOLTIP, KEY_LABEL, KEY_PATH, KEY_FILTER_TYPE_LIST, KEY_FILTER_TYPE_SEARCH, KEY_DIMENSION, KEY_TYPE, KEY_FILTER, KEY_FILTER_INIT, KEY_FILTER_TYPE_DETAILS } from '../config'
import { buildPath, buildHistogram } from '../../assets/js/utils'
import { basket } from '../index'
import levenshtein from 'js-levenshtein';

const state = () => ({
  // This holds the filter that are passed by the url
  [KEY_FILTER_INIT]: null,
  // This holds the currently applied filter settings
  [KEY_FILTER]: {}
})

const mutations = {
  CREATE_FACET (state, { key, type, tooltip, label, unit, id, popover, i, group, region, year, regions, [KEY_UNIQ_ID]: uniqID }) {
    // console.log('CREATE_FACET', id)
    // This mutation creates a facet by creating a dimension for this key
    // console.log({ key, type, label })
    const path = buildPath(type, key, year, region)
    console.log('CREATE_FACET CREATE_FACET CREATE_FACET', { uniqID, id, path, type, key, year, region })
    // It also sets the type of the facet. This is used later for the filtering technique
    const dimension = basket.dimension((d) => get(d, path, false))
    // Facets need different types of lists of options
    const facet = type === KEY_FILTER_TYPE_LIST ? getList(dimension) : dimension.group()

    // This describes the values if no filters are applied
    // We use this in the list to show the total value for each option and the light grey bars in the histogram
    // This will be empty if the data still needs to be loaded. It will be filled out later by `updateDimension`
    // If the user adds a facet by selecting it from the dropdown, the `makeDict` function already works as expected
    const init = makeDict(facet.all())
    console.log('Facet all:', facet.all())

    // console.log({ id })

    state[KEY_FILTER] = {
      ...state[KEY_FILTER],
      [uniqID]: {
        [KEY_PATH]: path,
        [KEY_TOOLTIP]: tooltip,
        [KEY_LABEL]: label,
        [KEY_DIMENSION]: dimension,
        [KEY_ID]: id,
        [KEY_UNIQ_ID]: uniqID,
        i,
        facet,
        [KEY_INIT]: init, // Describes the values if no filters are applied
        unit,
        group,
        year, // Used for details
        region, // Used for details
        regions, // Used for details
        [KEY_TYPE]: type,
        key,
        popover,
        // This is used to pass down settings or for a reset
        forcedValue: undefined,
        // These values are set on change, but are only needed for the url
        value: undefined,
        isInverted: undefined
      }
    }
  },
  APPLY_FILTER (state, { key, value, isInverted }) {
    // console.log({ key, value, isInverted })
    // console.log(state[KEY_FILTER][key])
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
        const term = deburr(trim(d).toLowerCase())
        let has = term.includes(value)
        if (!has) {
          has = levenshtein(term, value) < 3
        }
        // For the SearchFacet, we need to check if search is inverted or not as this can’t be handled by the Facet
        return isInverted ? !has : has
      })
    } else if (type === KEY_FILTER_TYPE_HISTOGRAM || type === KEY_FILTER_TYPE_DETAILS) {
      // console.log(state[KEY_FILTER][key]['year'])
      // console.log(state[KEY_FILTER][key][KEY_PATH])
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
  CHANGE_FACET_YEAR (state, { [KEY_UNIQ_ID]: uniqID, year }) {
    if (has(state, [KEY_FILTER, uniqID])) {
      const type = get(state, [KEY_FILTER, uniqID, KEY_TYPE])
      const region = get(state, [KEY_FILTER, uniqID, 'region'])
      const key = get(state, [KEY_FILTER, uniqID, 'key'])

      // We also provide the type to build a more complex path if it is for details
      const path = buildPath(type, key, year, region)

      state[KEY_FILTER][uniqID]['year'] = year
      state[KEY_FILTER][uniqID][KEY_PATH] = path
      state[KEY_FILTER][uniqID][KEY_DIMENSION].dispose()
      state[KEY_FILTER][uniqID][KEY_DIMENSION] = basket.dimension((d) => get(d, path, false))
      // console.log({ id, path, type, region, key, year })
    } else {
      console.log(`Facet for ${uniqID} should be there`)
    }
  },
  CHANGE_FACET_REGION (state, { [KEY_UNIQ_ID]: uniqID, region }) {
    if (has(state, [KEY_FILTER, uniqID])) {
      const type = get(state, [KEY_FILTER, uniqID, KEY_TYPE])
      const year = get(state, [KEY_FILTER, uniqID, 'year'])
      const key = get(state, [KEY_FILTER, uniqID, 'key'])

      // We also provide the type to build a more complex path if it is for details
      const path = buildPath(type, key, year, region)

      state[KEY_FILTER][uniqID]['region'] = region
      state[KEY_FILTER][uniqID][KEY_PATH] = path
      state[KEY_FILTER][uniqID][KEY_DIMENSION].dispose()
      state[KEY_FILTER][uniqID][KEY_DIMENSION] = basket.dimension((d) => get(d, path, false))
      // console.log({ id, path, type, region, key, year })
    } else {
      console.log(`Facet for ${uniqID} should be there`)
    }
  },
  RESET_FACET (state, uniqID) {
    // console.log('RESET_FACET')
    // console.log(key)
    state[KEY_FILTER][uniqID].value = undefined
    // console.log(state[KEY_FILTER][key])
    // This mutation resets all applied filtering on this dimension
    // console.log(state[KEY_FILTER])
    if (has(state, [KEY_FILTER, uniqID, KEY_DIMENSION])) {
      state[KEY_FILTER][uniqID][KEY_DIMENSION].filterAll()
    } else {
      console.log(`Dimension for ${uniqID} should be there`, state[KEY_FILTER][uniqID])
    }
    // console.log('RESET_FACET finished')
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
    // console.log('updateDimensions', state[KEY_FILTER])
    forEach(state[KEY_FILTER], (filter, key) => {
      // console.log({ filter, key })
      dispatch('updateDimension', key)
    })
  },
  updateDimension ({ state }, uniqID) {
    // console.log('updateDimension')
    // console.log({ uniqID }, state[KEY_FILTER][uniqID], state[KEY_FILTER])
    const { type, facet, dimension, [KEY_PATH]: path } = state[KEY_FILTER][uniqID]
    if (type === KEY_FILTER_TYPE_HISTOGRAM || type === KEY_FILTER_TYPE_DETAILS) {
      // console.log(dimension, facet)
      // const path = type === 'Details' ? `${key}-${2030}-${'World'}` : key
      // console.log({ path })
      const values = map(dimension.top(Infinity), (d) => get(d, path))
      // console.log({values})
      const { thresholds, bin } = buildHistogram(values)
      // console.log(1, '->', bin(1), 100, '->', bin(100), 200, '->', bin(200), 1000, '->', bin(1000))
      state[KEY_FILTER][uniqID].facet = dimension.group((d) => bin(d))// .reduce(...customReducer())
      state[KEY_FILTER][uniqID].thresholds = thresholds
      // console.log(state[KEY_FILTER][id].facet.top(Infinity))
    }
    console.log({ uniqID }, basket.all().length)
    console.log('makeDict:', makeDict(state[KEY_FILTER][uniqID].facet.all()))
    console.log('all', state[KEY_FILTER][uniqID].facet.all())
    console.log('groupBy', groupBy(basket.all(), item => get(item, 'metadata.baseline')))
    state[KEY_FILTER][uniqID][KEY_INIT] = makeDict(state[KEY_FILTER][uniqID].facet.all())
    // console.log('updateDimension finished')
  },
  addFacet ({ commit, dispatch }, options) {
    // This function is called for each visible facet
    // Options look like this { key: 'category', type: 'list' }
    const uniqID = uniqueId(options.id)
    const params = Object.assign(options, { [KEY_UNIQ_ID]: uniqID })
    // console.log('filter/addFacet', params)
    commit('CREATE_FACET', params)
    dispatch('updateDimension', uniqID)
    dispatch('apply')
  },
  removeFacet ({ commit, dispatch }, key) {
    // This function is called when a facet becomes invisible (is set hidden by the user)
    // Or if we are hard resetting the facets and want to delete all
    // Or if the visibility check removes it
    // console.log('filter/removeFacet', key)
    commit('REMOVE_FACET', key)
    dispatch('apply')
  },
  removeFilters ({ state, dispatch }) {
    // console.log('removing all filters')
    const facets = keys(state[KEY_FILTER])
    forEach(facets, (key) => {
      dispatch('removeFacet', key)
    })
    // console.log('removing all filters end:')
    // console.log(state[KEY_FILTER])
  },
  resetFilter ({ commit, dispatch }, uniqID) {
    // This function is called when a filter is resetted by the user
    // console.log('filter/resetFilter', key)
    commit('RESET_FACET', uniqID)
    dispatch('apply')
  },
  resetFacets ({ state, commit, dispatch }) {
    forEach(state[KEY_FILTER], (dimension, uniqID) => {
      commit('RESET_FACET', uniqID)
    })
  },
  changeFilterDetail ({ commit, dispatch, state }, { [KEY_UNIQ_ID]: uniqID, region, year }) {
    // For now, we need to reset all the filters because Crossfilter cannot remove just all the data
    // It can only delete the data that is currently filtered. So in order to remove really all the data we need to delete all current filter.
    // One idea to fix that would be to store the current filter in the init filters just like the url parameters
    dispatch('filter/resetFacets', null, { root: true })

    const key = get(state, [KEY_FILTER, uniqID, 'key'])

    // Are we changing the region?
    if (!isUndefined(region)) {
      commit('CHANGE_FACET_REGION', { uniqID, region })
      const year = get(state, [KEY_FILTER, uniqID, 'year'])
      dispatch('details/loadDetails', { list: [{ key, year, region }]}, { root: true })
    }

    // Are we changing the year?
    if (!isUndefined(year)) {
      commit('CHANGE_FACET_YEAR', { uniqID, year })
      const region = get(state, [KEY_FILTER, uniqID, 'region'])
      dispatch('details/loadDetails', { list: [{ key, year, region }]}, { root: true })
    }
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
    const allFacets = get(rootState, ['facets', KEY_FACETS_ALL])
    // This function is called by the SelectFacet popover
    // The parameter is a list of ids (not the uniqIDs!)
    // We don’t use the uniqIDs since the not yet added filter don’t have a unique id.
    // So we could not find them in the list with this id
    // Since we are only using non-details facets here in this function, we actually don’t need unique ids.
    const current = map(state[KEY_FILTER], KEY_ID)
    // We compare the soon to be list with the current one
    // This gives us a list of keys of filters that should be added
    const toBeAdded = difference(next, current)
    forEach(toBeAdded, (add) => {
      const facet = find(allFacets, { [KEY_ID]: add })
      if (facet) {
        dispatch('addFacet', facet)
      } else {
        // This should not happen. Could not think of a reason why it would.
        console.log(`Could not add facet ${facet}. It was note found.`)
      }
    })
    // This could probably be a bit more nicely soved but I just do it twice in revese order
    // This gives us a list of keys that should be removed
    const toBeRemoved = difference(current, next)
    forEach(toBeRemoved, (remove) => {
      const facet = find(allFacets, { [KEY_ID]: remove })
      // In order to remove it, we need the unique id, because that is what the removeFacet function uses.
      const uniqID = get(facet, KEY_UNIQ_ID)
      if (uniqID) {
        dispatch('removeFacet', uniqID)
      } else {
        // This should not happen. Could not think of a reason why it would.
        console.log(`Could not remove facet ${remove}. It was note found.`)
      }
    })
    dispatch('facets/filter', null, { root: true })
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
        // console.log(`Filter ${key} not found. Will create it.`)
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
        // console.log(`Filter ${key} found and applied with values ${values}.`)
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
