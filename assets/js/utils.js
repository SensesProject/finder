import { round, isBoolean, get, map, forEach, set, kebabCase, startsWith, keys, replace } from 'lodash'
import { format } from 'timeago.js'
import { extent } from 'd3-array'
import { scaleLinear, scaleThreshold } from 'd3-scale'
import { KEY_FILTER_TYPE_DETAILS, KEY_FILTER_TYPE_HISTOGRAM } from '../../store/config'

export const getLabel = function (value, type, precision) {
  // The label can be different. It’s based on the type of the column
  let label = value
  if (type === 'Facet' || type === KEY_FILTER_TYPE_SEARCH) {
    if (isBoolean(label)) {
      label = label ? 'Yes' : 'No'
    } else {
      if (!label) {
        label = '—'
      } else {
        label = label
          .replace(/[_-]/g, ' ')
          .replace(/1p5/g, '1.5')
      }
    }
  } else if (type === KEY_FILTER_TYPE_HISTOGRAM || type === 'Scatterplot') {
    label = round(label, precision || 0)
  }
  return label
}

export const getPopover = function (pop, datum) {
  // Build the popover properties
  const popover = get(pop, 'url', false) // Checks if column has a popover
  let popoverID // ID used for the url to request information displayed in popover
  let popoverKey
  if (popover) {
    const path = get(pop, 'path', false)
    popoverID = get(datum, path, false)
    popoverKey = get(pop, 'key', false)
  }
  return { popoverID, popoverKey, popover }
}

export const isTooOld = function (date) {
  if (!date) { return false }
  const ONE_DAY = 60 * 60 * 1000 * 24
  // console.log(`Data was loaded ${format(date)}`)
  return ((new Date()) - new Date(date)) > ONE_DAY
}

export const extractFromGoogleTable = function (keys, data) {
  // This function extracts the relevant data from the Google Sheet response
  return map(get(data, ['feed', 'entry']), (entry, i) => {
    const obj = { i }
    forEach(keys, key => {
      let value = get(entry, [`gsx$${key}`, '$t'])
      // Some reformatting if value is TRUE or FALSE
      switch (value) {
        case 'TRUE':
          value = true
          break
        case 'FALSE':
          value = false
          break
      }
      set(obj, key, value)
    })
    // Generate a id for each facet. This is used to trigger each filter
    set(obj, 'id', kebabCase(get(entry, [`gsx$label`, '$t'])))
    return obj
  })
}

export const extractFromGoogleTable2 = function (data) {
  return map(get(data, ['feed', 'entry']), entry => {
    const obj = {}
    forEach(keys(entry), key => {
      if (startsWith(key, 'gsx$')) {
        const path = replace(key, 'gsx$', '')
        let value = get(entry, [key, '$t'])
        switch (value) {
          case 'TRUE':
            value = 'Yes'
            break
          case 'FALSE':
            value = 'No'
            break
        }
        set(obj, path, value)
      }
    })
    return obj
  })
}

export const detailPath = function (key, year, region) {
  return `${key}-${year}-${region}`
}

export const buildPath = function (type, key, year, region) {
  if (type === KEY_FILTER_TYPE_DETAILS) {
    return detailPath(key, year, region)
  } else {
    return key
  }
}

export const buildHistogram = function (values) {
  const domain = extent(values)
  const scale = scaleLinear().domain(domain).nice()
  const thresholds = scale.ticks(40)
  const bin = scaleThreshold().domain(thresholds).range(thresholds)
  return { thresholds, bin }
}

const KEY_REGIONS = 'regions'
const KEY_VARIABLES = 'variables'
const KEY_YEARS = 'years'

export const extractDetailsFromBody = function (body) {
  const region = get(body, ['filters', KEY_REGIONS, 0], false)
  const variable = get(body, ['filters', KEY_VARIABLES, 0], false)
  const year = get(body, ['filters', KEY_YEARS, 0], false)

  return { region, variable, year }
}

export const buildBodyFromDetails = function (runs, year, region, variable) {
  return {
    filters: {
      runs,
      [KEY_YEARS]: [year],
      [KEY_REGIONS]: [region],
      [KEY_VARIABLES]: [variable]
    }
  }
}

export const getRunIds = function (basket) {
  return map(basket.dimension((d) => get(d, 'run_id', false)).group().all(), 'key')
}

export const buildConfigForRequest = function (rootState) {
  const config = {}

  // Check if there is a url for authorization
  if (get(rootState, ['auth', 'url'], false)) {
    set(config, 'headers.Authorization', `Bearer ${rootState.auth.token}`)
  }

  return config
}
