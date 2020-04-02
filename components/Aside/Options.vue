<template>
  <ul class="options">
    <li><input v-model="optionsFilterProp" id="optionsFilter" type="checkbox" /> <label for="optionsFilter">Hide empty options</label></li>
    <li><input v-model="sortRemainingProp" id="sortRemaining" type="checkbox" /> <label for="sortRemaining">Sort by remaining amount</label></li>
    <li><input v-model="columnHoverEffectProp" id="columnHoverEffect" type="checkbox" /> <label for="columnHoverEffect">Show column hover effect</label></li>
    <li><input v-model="cellHoverEffectProp" id="cellHoverEffect" type="checkbox" /> <label for="cellHoverEffect">Show cell hover effect</label></li>
    <li><input v-model="displayURLProp" id="displayURL" type="checkbox" /> <label for="displayURL">Show filter in URL</label></li>
  </ul>
</template>

<script>
  import { mapState, mapActions } from 'vuex'
  import { get } from 'lodash'

  export default {
    computed: {
      ...mapState({
        filterEmpty: state => get(state, 'options.filterEmpty', false),
        sortRemaining: state => get(state, 'options.sortRemaining', false),
        columnHoverEffect: state => get(state, 'options.columnHoverEffect', false),
        cellHoverEffect: state => get(state, 'options.cellHoverEffect', false),
        displayURL: state => get(state, 'options.displayURL', false)
      }),
      optionsFilterProp: {
        get () {
          return this.filterEmpty
        },
        set (value) {
          this.setFilterEmpty({ value })
        }
      },
      sortRemainingProp: {
        get () {
          return this.sortRemaining
        },
        set (value) {
          this.setSortRemaining({ value })
        }
      },
      columnHoverEffectProp: {
        get () {
          return this.columnHoverEffect
        },
        set (value) {
          this.setColumnHoverEffect({ value })
        }
      },
      cellHoverEffectProp: {
        get () {
          return this.cellHoverEffect
        },
        set (value) {
          this.setCellHoverEffect({ value })
        }
      },
      displayURLProp: {
        get () {
          return this.displayURL
        },
        set (value) {
          this.setDisplayURL(value)
        }
      }
    },
    methods: {
      ...mapActions([
        'setFilterEmpty',
        'setSortRemaining',
        'setColumnHoverEffect',
        'setCellHoverEffect',
        'setDisplayURL'
      ])
    }
  }
</script>

<style lang="scss" scoped>
  @import "~@/assets/style/global";

  .tooltip[aria-hidden='true'] {
    display: none;
  }

  .options {
    li {
      color: palette(grey, 10);
      font-size: $size-smallest;
      margin-bottom: $spacing / 4;

      &:last-child {
        margin-bottom: 0;
      }

      input {
        margin-right: $spacing / 6;
      }
    }
  }
</style>
