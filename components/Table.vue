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
              <i class="option icon-filter clickable" @click="setFacet({ key: cell.key, value: cell.label })" :title="`Filter table by »${cell.label || '—'}«`" />
              <i
                class="option icon-popup clickable"
                @click="setFacet({ key: cell.key, value: cell.label })"
                :title="`Show more information about »${cell.label || '—'}« in popover`"
                v-if="cell.hasPopover" />
            </section>
          </div>
        </td>
      </tr>
    </tbody>
    <tbody v-else>
      <tr>
        <td class="message" :colspan="1">No item found</td>
      </tr>
    </tbody>
  </table>
</template>

<script>
  import { mapState, mapGetters, mapActions } from 'vuex'
  import _ from 'lodash'

  export default {
    computed: {
      ...mapState([
        'hover',
        'activeKey'
      ]),
      ...mapGetters([
        'visibleHeader',
        'result'
      ]),
      items () {
        return _.map(this.result, item => {
          // For each row: build an array of values based on the visible headers
          const cells = _.map(this.visibleHeader, key => {
            return item[key]
            // return {
            //   // 'label': _.isArray(item[key]) ? item[key].join(', ') : item[key], // Check if item is an array and merge if so
            //   key
            // }
          })

          let active = false // By default, the cell is not highlighted
          if (this.hover && !_.isUndefined(this.hover.key) && !_.isUndefined(this.hover.value)) { // Check if hover is defined and if key and value is defined. The key defines the hovered column and value the (to be) highlighted value in this column
            if (_.isArray(item[this.hover.key])) { // If multiple keys are hovered
              console.log('here')
              if (_.indexOf(item[this.hover.key], this.hover.value) >= 0) {
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
        'setFacet'
      ])
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

      .option {
        color: rgba(0, 0, 0, 0.2);
        opacity: 0;

        &:hover {
          color: rgba(0, 0, 0, 1);
        }
      }
    }
  }

  .message {
    text-align: left;
  }
</style>
