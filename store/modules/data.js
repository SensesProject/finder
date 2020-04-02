import { get, map } from 'lodash'
// import { includes, compact, get, map, fromPairs, countBy, flatten, indexOf, lowerCase, inRange } from 'lodash'
// import { getLabel, getPopover } from '../../assets/js/utils'
import { basket } from '../index'

// function processData (data, facets) {
//   return map(data, datum => {
//     // Rebuild the data structure. Build an object from the data array
//     return fromPairs(map(facets, ({ id, key, type, precision, popover }) => {
//       const values = get(datum, key, false)

//       const label = getLabel(values, type, precision)

//       const obj = {
//         id,
//         key,
//         values,
//         label,
//         lower: lowerCase(label), // This is used for the search facet
//         ...getPopover(popover, datum)
//       }
//       return [id, obj]
//     }))
//   })
// }

const actions = {
  addData ({ dispatch }, datum) {
    // Remove all elements. Should be empty
    basket.remove(true)

    // Add new data
    basket.add(map(datum, d => {
      return {
        id: d['run_id'],
        scenario: d['scenario'],
        category: get(d, ['metadata', 'category']),
        project: get(d, ['metadata', 'project'])
      }
    }))

    // Apply filtering
    dispatch('apply', false, { root: true })
  }
}

const getters = {
  // Datum contains all relevant data. It loops over all data rows
  // and builds each object based on the facets
  // datum: (state, getters, rootState) => {
  //   console.log('DATUM called')
  //   const data = get(rootState, 'load.data', [])
  //   const facets = get(rootState, 'facets.facets', [])
  //   console.log(processData(data, facets))
  //   return processData(data, facets)
  // },
  // This lists all options for every facet and how often they occure in datum
  // options: (state, getters, rootState) => {
  //   const facets = get(rootState, 'facets.facets', [])
  //   const visibleFacets = rootState.facets.visibleFacets

  //   return compact(facets.map(facet => {
  //     const { id } = facet
  //     if (!includes(visibleFacets, id)) {
  //       return false
  //     }

  //     // Count all options for that facet (respectively id)
  //     const options = countBy(getters.datum.map(item => {
  //       return get(item, [id, 'label'])
  //     }))
  //     const values = compact(getters.datum.map(item => {
  //       return get(item, [id, 'values'])
  //     }))
  //     return {
  //       ...facet,
  //       options,
  //       values
  //     }
  //   }))
  // },
  // This is the list of times filtered by the applied filters
  // result: (state, getters, rootState) => {
  //   let result = getters.datum
  //   const filter = get(rootState, 'filter.filter', [])
  //   // Loop over every filter
  //   filter.forEach(filta => {
  //     let term
  //     if (filta.type === 'term') {
  //       term = lowerCase(filta.values)
  //     }
  //     // Filter the list of results with every loop
  //     result = result.filter(item => {
  //       let retVal = true
  //       if (filta.type === 'term') { // Facet is search term
  //         retVal = item[filta.key].lower.includes(term)
  //       } else if (filta.type === 'key-value') {
  //         const label = get(item[filta.id], 'label')
  //         retVal = label ? indexOf(filta.values, label) > -1 : true
  //       } else if (filta.type === 'range') {
  //         // TODO: Does not include end
  //         const low = get(filta, 'values[0].low', -Infinity)
  //         const high = get(filta, 'values[0].high', Infinity)
  //         retVal = inRange(item[filta.id].label, low, high)
  //       }
  //       return filta.invert ? !retVal : retVal
  //     })
  //   })
  //   return result
  // },
  // This is a list of options and how often they occure in the result list
  // counter: (state, getters, rootState) => {
  //   const facets = get(rootState, 'facets.facets', [])
  //   const values = facets.map(facet => {
  //     const { id } = facet
  //     const options = countBy(flatten(getters.result.map(item => get(item, [id, 'label']))))
  //     return [id, options]
  //   })
  //   return fromPairs(values)
  // }
}

export default {
  // namespaced: true,
  actions,
  getters
}
