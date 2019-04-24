<template>
  <table>
    <!-- <thead>
      <tr>
        <th
          v-for="key in header"
          :class="{ 'active': activeKey === key }">{{ key }}</th>
      </tr>
    </thead> -->
    <tbody v-if="items.length">
      <tr
        v-for="(row, n) in items"
        :class="{ 'hover': row.active }">
        <td
          v-for="cell in row.cells"
          :class="{ 'active': activeKey === cell.key }"
          @mouseenter="setHover({ key: cell.key, value: cell.label })"
          @mouseleave="resetHover()">
          <div>
            <span class="label">{{ cell.label || '—' }}</span>
            <section>
              <i
                class="option icon-filter clickable"
                @click="setFacet({ key: cell.key, value: cell.label })"
                v-tooltip="{ content: `Filter table by »${cell.label || '—'}«`, placement: 'bottom', delay: { show: 100, hide: 0 } }" />
              <i
                class="option icon-popup clickable"
                @click="openPopover(cell)"
                v-tooltip="{ content: `Show more information about »${cell.label || '—'}« in popover`, placement: 'bottom', delay: { show: 100, hide: 0 } }"
                v-if="cell.popover" />
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
</template>

<script>
  import { mapState, mapGetters, mapActions } from 'vuex'
  import { map, get, indexOf, isUndefined, isArray } from 'lodash'
  import Loading from '~/components/Loading.vue'

  export default {
    computed: {
      ...mapState([
        'hover',
        'activeKey'
      ]),
      ...mapState({
        status: state => get(state, 'data.status', 'ERROR')
      }),
      ...mapGetters([
        'visibleHeader',
        'result'
      ]),
      items () {
        return map(this.result, item => {
          // For each row: build an array of values based on the visible headers
          const cells = map(this.visibleHeader, key => {
            // console.log(item[key])
            return item[key]
            // return {
            //   // 'label': isArray(item[key]) ? item[key].join(', ') : item[key], // Check if item is an array and merge if so
            //   key
            // }
          })

          let active = false // By default, the cell is not highlighted
          if (this.hover && !isUndefined(this.hover.key) && !isUndefined(this.hover.value)) { // Check if hover is defined and if key and value is defined. The key defines the hovered column and value the (to be) highlighted value in this column
            if (isArray(item[this.hover.key])) { // If multiple keys are hovered
              console.log('here')
              if (indexOf(item[this.hover.key], this.hover.value) >= 0) {
                active = true
              }
            } else { // If a single key is hovered
              // console.log(this.hover.value, item[this.hover.key])
              if (item[this.hover.key].label === this.hover.value) {
                active = true
              }
            }
          }

          return {
            cells,
            active
          }
        })
      }
    },
    methods: {
      ...mapActions([
        'setHover',
        'resetHover',
        'setFacet',
        'openPopover'
      ])
    },
    components: {
      Loading
    }
  }
</script>

<style lang="scss" scoped>
  @import "~@/assets/style/variables";

  table {
    line-height: 1.2;
    font-size: $size-smallest;
    border-spacing: 0;
    border-collapse: collapse;
    table-layout: fixed;

    tr td, tr th {
      transition: all 0.1s;
      display: inline-block;
      width: calc(#{$column-width} + #{$spacing / 2});
      padding-left: $spacing / 4;
      padding-right: $spacing / 4;
      overflow: hidden;
      white-space: nowrap;

      &:first-child {
        padding-left: 0;
        width: calc(#{$column-width} + #{$spacing / 4} + 1rem);
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
</style>
