<template>
  <div class="content">
    <table>
      <thead>
        <tr>
          <th>
            <TableCounter />
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
            v-for="({ label, key, popoverContent }, i) in cells"
            :key="key">
            <div>
              <!-- <span v-if="cell.popover" class="label clickable" @click="openPopover(cell)" v-tooltip="{ content: `Show more information about »${cell.label || '—'}« in popover`, placement: 'bottom', delay: { show: 100, hide: 0 } }">{{ cell.label || '—' }}</span> -->
              <span class="label">{{ label }}</span>
              <section>
                <i
                  class="option icon-popup clickable"
                  @click="openContentPopover(popoverContent)"
                  v-tooltip="{ content: `Show more information about »${label || '—'}« in popover`, placement: 'bottom', delay: { show: 100, hide: 0 } }"
                  v-if="popoverContent" />
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
  import { mapState, mapActions } from 'vuex'
  import { map, get } from 'lodash'
  import { KEY_PATH, KEY_FILTER } from '~/store/config'
  import Loading from '~/components/Loading.vue'
  import TableNavigation from '~/components/Table/TableNavigation.vue'
  import TableCounter from '~/components/Table/TableCounter.vue'

  export default {
    computed: {
      ...mapState({
        status: state => get(state, 'data.status', 'ERROR'),
        filter: state => get(state, ['filter', KEY_FILTER], {})
      }),
      ...mapState('datum', [
        'datum'
      ]),
      elements () {
        // Get the filtered data from the basket
        return map(this.datum, (datum) => {
          // Loop over the visible facets and build row
          const cells = map(this.filter, (filter) => {
            const key = filter[KEY_PATH]
            const popoverContent = get(datum, get(filter, ['popover', 'content'], false), false)
            return {
              label: get(datum, key, '–'),
              popoverContent,
              key
            }
          })
          return {
            row: datum.run_id,
            cells
          }
        })
      }
    },
    methods: {
      ...mapActions([
        'setFilter',
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
          width: $column-width;
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
          vertical-align: top;

          &:last-child {
            width: auto !important;
          }
        }
      }
    }

    tbody {
      tr {
        &:hover {
          color: $color-accent;

          .option {
            opacity: 1;
          }
        }

        td {
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
