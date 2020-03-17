import { includes, compact, get, isBoolean, map, fromPairs, round, countBy, flatten, indexOf, lowerCase, inRange } from 'lodash'

const getters = {
  // Datum contains all relevant data. It loops over all data rows
  // and builds each object based on the facets
  datum: (state, getters, rootState) => {
    const facets = get(rootState, 'facets.facets', [])
    return map(get(rootState, 'load.data', []), datum => {
      // Rebuild the data structure. Build an object from the data array
      return fromPairs(map(facets, facet => {
        const { id, key } = facet
        const values = get(datum, key, false)

        // The label can be different. It’s based on the type of the column
        let label = values
        if (facet.type === 'Facet' || facet.type === 'Search') {
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
        } else if (facet.type === 'Histogram' || facet.type === 'Scatterplot') {
          label = round(label, facet.precision || 0)
        }

        // Build the popover properties
        const popover = get(facet, 'popover.url', false) // Checks if column has a popover
        let popoverID // ID used for the url to request information displayed in popover
        let popoverKey
        if (popover) {
          const path = get(facet, 'popover.path', false)
          popoverID = get(datum, path, false)
          popoverKey = get(facet, 'popover.key', false)
        }

        const obj = {
          id,
          key,
          values,
          label,
          lower: lowerCase(label), // This is used for the search facet
          popover,
          popoverID,
          popoverKey
        }
        return [facet.id, obj]
      }))
    })
  },
  // This lists all options for every facet and how often they occure in datum
  options: (state, getters, rootState) => {
    const facets = get(rootState, 'facets.facets', [])
    const visibleFacets = rootState.facets.visibleFacets

    return compact(facets.map(facet => {
      const { id } = facet
      if (!includes(visibleFacets, id)) {
        return false
      }

      // Count all options for that facet (respectively id)
      const options = countBy(getters.datum.map(item => {
        return get(item, [id, 'label'])
      }))
      const values = compact(getters.datum.map(item => {
        return get(item, [id, 'values'])
      }))
      return {
        ...facet,
        options,
        values
      }
    }))
  },
  // This is the list of times filtered by the applied filters
  result: (state, getters, rootState) => {
    let result = getters.datum
    const filter = get(rootState, 'filter.filter', [])
    // Loop over every filter
    filter.forEach(filta => {
      let term
      if (filta.type === 'term') {
        term = lowerCase(filta.values)
      }
      // Filter the list of results with every loop
      result = result.filter(item => {
        let retVal = true
        if (filta.type === 'term') { // Facet is search term
          retVal = item[filta.key].lower.includes(term)
        } else if (filta.type === 'key-value') {
          const label = get(item[filta.id], 'label')
          retVal = label ? indexOf(filta.values, label) > -1 : true
        } else if (filta.type === 'range') {
          // TODO: Does not include end
          const low = get(filta, 'values[0].low', -Infinity)
          const high = get(filta, 'values[0].high', Infinity)
          retVal = inRange(item[filta.id].label, low, high)
        }
        return filta.invert ? !retVal : retVal
      })
    })
    return result
  },
  // This is a list of options and how often they occure in the result list
  counter: (state, getters, rootState) => {
    const facets = get(rootState, 'facets.facets', [])
    const values = facets.map(facet => {
      const { id } = facet
      const options = countBy(flatten(getters.result.map(item => get(item, [id, 'label']))))
      return [id, options]
    })
    return fromPairs(values)
  }
}

export default {
  getters
}
