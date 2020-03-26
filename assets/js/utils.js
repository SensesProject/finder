import { round, isBoolean, get } from 'lodash'

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
  const ONE_DAY = 60 * 60 * 1000 * 24
  return ((new Date()) - new Date(date)) > ONE_DAY
}
