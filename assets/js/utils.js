import { round, isBoolean, get, map, forEach, set, kebabCase, startsWith, keys, replace } from 'lodash'
import { format } from 'timeago.js'

export const getLabel = function (value, type, precision) {
  // The label can be different. It’s based on the type of the column
  let label = value
  if (type === 'Facet' || type === 'Search') {
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
  } else if (type === 'Histogram' || type === 'Scatterplot') {
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
