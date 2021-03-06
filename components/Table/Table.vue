<template>
  <div class="content">
    <table>
      <thead>
        <tr>
          <th>
            <TableCounter :label="label" />
          </th>
          <th :colspan="filter.length">
            <TableNavigation />
          </th>
        </tr>
      </thead>
      <tbody v-if="elements.length">
        <tr
          v-for="({ cells, row }, n) in elements"
          :key="row">
          <td
            v-for="({ label, key, popoverContent, isNumber }, i) in cells"
            :key="key">
            <div :class="{ isNumber }">
              <span :class="['label', { popoverContent }]" @click="popoverContent ? openContentPopover(popoverContent) : false">{{ label || '—' }}</span>
              <section>
                <i
                  class="option glyph-finder-popup clickable"
                  @click="openContentPopover(popoverContent)"
                  v-tooltip="{ content: `Show more information about »${label || '—'}« in popover`, placement: 'bottom', delay: { show: 100, hide: 0 } }"
                  v-if="popoverContent" />
              </section>
            </div>
          </td>
        </tr>
      </tbody>
      <tbody v-else>
        <tr>
          <td v-if="status === 'STATUS_LOADING' || status === 'IDLE'" class="message" :colspan="1"><Loading /></td>
          <td v-else class="message" :colspan="1">No {{ label }}s found</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
  import { mapState, mapActions } from 'vuex'
  import { map, get, sortBy } from 'lodash'
  import { KEY_PATH, KEY_FILTER, KEY_FILTER_TYPE_HISTOGRAM, KEY_FILTER_TYPE_DETAILS } from '~/store/config'
  import Loading from '~/components/Loading.vue'
  import TableNavigation from '~/components/Table/TableNavigation.vue'
  import TableCounter from '~/components/Table/TableCounter.vue'
  import { isNumericFacet } from '~/assets/js/utils'

  export default {
    props: {
      label: {
        type: String,
        default: 'item'
      }
    },
    computed: {
      ...mapState({
        status: state => get(state, 'data.status', 'ERROR'),
        filter: state => get(state, ['filter', KEY_FILTER], {})
      }),
      ...mapState('datum', [
        'datum'
      ]),
      elements () {
        const filters = sortBy(map(this.filter), 'i')
        // Get the filtered data from the basket
        return map(this.datum, (datum) => {
          // Loop over the visible facets and build row
          const cells = map(filters, (filter) => {
            // Check if the cell has a popover
            const popoverContent = get(datum, get(filter, ['popover', 'content'], false), false)

            // The text alignment is different for histograms
            const isNumber = isNumericFacet(get(filter, 'type'))

            return {
              label: get(datum, filter[KEY_PATH], '–'),
              popoverContent,
              key: get(datum, 'id'), // We use the id to have unique keys for each element
              isNumber
            }
          })
          return {
            row: datum.run_id, // We use the scenario id as unique row id
            cells
          }
        })
      }
    },
    methods: {
      ...mapActions([
        'openPopover',
        'openContentPopover'
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

      tr {
        border-bottom: 1px solid $color-bg-mute;
      }

      tr td, tr th {
        display: inline-block;
        width: calc(#{$facet-width} + #{$facet-gap});
        padding-left: $spacing / 4;
        padding-right: $spacing / 4;
        overflow: hidden;
        white-space: nowrap;

        &:first-child {
          padding-left: 0;
          width: calc(#{$facet-width} + #{$facet-gap});
          margin-left: 1rem;
        }

        &:last-child {
          padding-right: 0;
          width: $facet-width;
        }
      }
    }

    thead {
      tr {
        th {
          margin: $spacing / 4 0;
          vertical-align: middle;
          text-align: left;
          padding: 0 0.1em;

          &:last-child {
            width: auto !important;
          }
        }
      }
    }

    tbody {
      tr {
        &:hover {
          color: $color-interactive;

          .option {
            opacity: 1;
          }
        }

        td {
          padding: $spacing / 8 0;
          white-space: nowrap;

          div {
            padding: 0 0.1em;
            padding-right: $facet-gap;
            display: flex;
            flex-direction: row;
            justify-content: space-between;

            &.isNumber {
              padding-left: 50px;
            }

            .label {
              text-overflow: ellipsis;
              overflow: hidden;
              white-space: nowrap;
              display: inline-block;

              &.popoverContent {
                cursor: pointer;
              }
            }

            .option {
              display: inline-block;
              color: $color-light-gray;
              transition: opacity $transition, color $transition;
              opacity: 0.001;

              &:hover {
                color: $color-black;
              }
            }
          }
        }

        &:last-child td {
          border-bottom: 0;
        }
      }
    }
  }
</style>
