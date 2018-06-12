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
          :class="{ 'active': activeKey === cell.key, clickable: true }"
          @mouseenter="setHover({ key: cell.key, value: cell.label })"
          @mouseleave="resetHover()"
          @click="setFacet({ key: cell.key, value: cell.label })">{{ cell.label }}</td>
      </tr>
    </tbody>
    <tbody v-else>
      <tr>
        <td class="message" :colspan="header.length + 1">No item found</td>
      </tr>
    </tbody>
  </table>
</template>

<script>
  import { mapState, mapActions } from 'vuex'
  import _ from 'lodash'

  export default {
    props: ['data'],
    computed: {
      ...mapState([
        'header',
        'hover',
        'activeKey'
      ]),
      items () {
        return _.map(this.data, item => {
          const cells = _.map(this.header, key => {
            return {
              'label': _.isArray(item[key]) ? item[key].join(', ') : item[key],
              key
            }
          })

          let active = false
          // console.log(this.hover)
          if (this.hover && !_.isUndefined(this.hover.key) && !_.isUndefined(this.hover.value)) {
            if (_.isArray(item[this.hover.key])) {
              if (_.indexOf(item[this.hover.key], this.hover.value) >= 0) {
                active = true
              }
            } else {
              if (item[this.hover.key] === this.hover.value) {
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

    tr td, tr th {
      width: calc(220px + #{$spacing / 2});
      padding-left: $spacing / 4;
      padding-right: $spacing / 4;
      overflow: hidden;
      white-space: nowrap;

      &:first-child {
        padding-left: 0;
        width: calc(220px + #{$spacing / 4});
      }

      &:last-child {
        padding-right: 0;
        width: calc(220px + #{$spacing / 4});
      }
    }
  }

  th {
    text-align: left;
    padding: 0 0.1em;
    vertical-align: top;
  }

  tbody tr:hover {
    color: #E38A73;
  }

  tbody tr.hover {
    color: #fff;
    background-color: #E38A73;
  }

  th.active, td.active {
    color: #E38A73;
  }

  tbody tr.hover td.active {
    color: #fff;
  }

  tr td {
    border-bottom: 1px solid $color-bg-mute;
    padding: $spacing / 8 0.1em;
    white-space: nowrap;
  }

  .message {
    text-align: center;
  }
</style>
