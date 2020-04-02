<template>
  <div class="content">
    <table>
      <thead>
        <tr>
          <td>
            <TableCounter />
          </td>
          <td :colspan="filter.length">
            <TableNavigation />
          </td>
        </tr>
      </thead>
      <tbody v-if="elements.length">
        <tr
          v-for="({ cells, row }, n) in elements"
          :key="row"
          :class="{ 'hover': false }">
          <td
            v-for="(cell, i) in cells"
            :key="i">
            <div>
              <!-- <span v-if="cell.popover" class="label clickable" @click="openPopover(cell)" v-tooltip="{ content: `Show more information about »${cell.label || '—'}« in popover`, placement: 'bottom', delay: { show: 100, hide: 0 } }">{{ cell.label || '—' }}</span> -->
              <span class="label">{{ cell || '—' }}</span>
              <section>
               <!--  <i
                  class="option icon-popup clickable"
                  @click="openPopover(cell)"
                  v-tooltip="{ content: `Show more information about »${cell.label || '—'}« in popover`, placement: 'bottom', delay: { show: 100, hide: 0 } }"
                  v-if="cell.popover" /> -->
                <!-- <i
                  class="option icon-filter clickable"
                  @click="setFilter({ key: cell.key, value: cell.label })"
                  v-tooltip="{ content: `Set »${cell.label || '—'}« as filter option`, placement: 'bottom', delay: { show: 100, hide: 0 } }" /> -->
              </section>
            </div>
          </td>
        </tr>
      </tbody>
      <tbody v-else>
        <tr>
          <td v-if="status === 'STATUS_LOADING' || status === 'IDLE'" class="message" :colspan="1"><Loading /></td>
          <td v-else class="message" :colspan="1">No scenarios found</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
  import { mapState, mapGetters, mapActions } from 'vuex'
  import { compact, map, get } from 'lodash'
  import { KEY_PATH, KEY_FILTER } from '~/store/config'
  import Loading from '~/components/Loading.vue'
  import TableNavigation from '~/components/Table/TableNavigation.vue'
  import TableCounter from '~/components/Table/TableCounter.vue'

  export default {
    computed: {
      ...mapState({
        // facets: state => get(state, 'facets.facets', []),
        status: state => get(state, 'data.status', 'ERROR'),
        hoverValue: state => get(state, 'hover.hoverValue', false),
        hoverKey: state => get(state, 'hover.hoverKey', false),
        // data: state => get(state, 'data.data', []),
        filter: state => get(state, ['filter', KEY_FILTER], {})
        // visibleFacets: state => get(state, ['facets', KEY_FACETS_VISIBLE], [])
      }),
      ...mapGetters([
        'result'
      ]),
      ...mapState('datum', [
        'datum'
      ]),
      elements () {
        // const facetIDs = map(this.facets, 'id')
        // Get the filtered data from the basket
        return map(this.datum, (datum) => {
          // Loop over the visible facets and build row
          const cells = compact(map(this.filter, (filter) => {
            return get(datum, filter[KEY_PATH], '–')
          }))
          return {
            row: datum.run_id,
            cells
          }
        })
      }
      // items () {
      //   const facetIDs = map(this.facets, 'id')
      //   return map(this.result, item => {
      //     // For each row: build an array of values based on the visible headers
      //     const cells = compact(map(facetIDs, id => {
      //       return includes(this.visibleFacets, id) ? get(item, id) : false
      //     }))

      //     const hover = get(this, 'hoverValue', false)
      //     const id = get(this, 'hoverValue.id', undefined)
      //     const value = get(this, 'hoverValue.value', undefined)

      //     let active = false // By default, the cell is not highlighted
      //     if (hover && !isUndefined(id) && !isUndefined(value)) { // Check if hover is defined and if id and value is defined. The id defines the hovered column and value the (to be) highlighted value in this column
      //       if (isArray(item[id])) { // If multiple ids are hovered
      //         if (indexOf(item[id], value) >= 0) {
      //           active = true
      //         }
      //       } else { // If a single id is hovered
      //         if (item[id].label === value) {
      //           active = true
      //         }
      //       }
      //     }

      //     return {
      //       cells,
      //       active
      //     }
      //   }).slice(...this.currentRange)
      // },
      // numberOfPages () {
      //   return Math.ceil((this.result.length || 0) / this.itemsPerPage)
      // }
    },
    methods: {
      ...mapActions([
        'setHoverValue',
        'resetHoverValue',
        'setFilter',
        'openPopover'
      ])
    },
    components: {
      Loading,
      TableNavigation,
      TableCounter
    }
  }
</script>

<style lang="scss" scoped>
  @import "~@/assets/style/global";

  .content {
    padding: 0 0 1rem;

    table {
      line-height: 1.2;
      font-size: $size-smallest;
      border-spacing: 0;
      border-collapse: collapse;
      table-layout: fixed;

      tr td, tr th {
        transition: all 0.1s;
        display: inline-block;
        width: calc(#{$column-width} + #{$column-gap});
        padding-left: $spacing / 4;
        padding-right: $spacing / 4;
        overflow: hidden;
        white-space: nowrap;

        &:first-child {
          padding-left: 0;
          width: calc(#{$column-width} + #{$column-gap} + #{$spacing / 4});
          padding-left: 1rem;
        }

        &:last-child {
          padding-right: 0;
          width: calc(#{$column-width});
        }
      }
    }

    th {
      text-align: left;
      padding: 0 0.1em;
      vertical-align: top;
    }

    tbody tr:hover {
      color: $color-violet;

      .option {
        opacity: 1;
      }
    }

    tbody tr.hover {
      color: #000;
      background-color: rgba($color-green, 0.2)
    }

    th.active, td.active {
      color: darken($color-green, 10);
    }

    tbody tr.hover td.active {
      color: #000;
    }

    tr td {
      border-bottom: 1px solid $color-bg-mute;
      padding: $spacing / 8 0.1em;
      white-space: nowrap;

      div {
        display: flex;
        flex-direction: row;
        justify-content: space-between;

        .label {
          text-overflow: ellipsis;
          overflow: hidden;
          white-space: nowrap;
        }

        .option {
          display: inline-block;
          color: rgba(0, 0, 0, 0.8);
          transition: 0.2s;
          opacity: 0.001;

          &:hover {
            color: rgba(0, 0, 0, 1);
          }
        }
      }
    }

    tr:last-child td {
      border-bottom: 0;
    }

    .message {
      text-align: center;
      width: 100% !important;

      & > * {
        height: 2em;
      }
    }

    thead {
      tr {
        border-bottom: 1px solid $color-bg-mute;

        td {
          margin: $spacing / 4 0;
          vertical-align: middle;

          &:last-child {
            width: auto !important;
          }
        }
      }
    }
  }
</style>
