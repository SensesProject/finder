<template>
  <ul class="options">
    <li><input v-model="optionsFilterProp" id="optionsFilter" type="checkbox" /> <label for="optionsFilter">Hide empty options</label></li>
    <li><input v-model="sortRemainingProp" id="sortRemaining" type="checkbox" /> <label for="sortRemaining">Sort by remaining amount</label></li>
  </ul>
</template>

<script>
  import { mapState, mapActions } from 'vuex'
  import { get } from 'lodash'

  export default {
    computed: {
      ...mapState({
        filterEmpty: state => get(state, 'options.filterEmpty', false),
        sortRemaining: state => get(state, 'options.sortRemaining', false)
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
      }
    },
    methods: {
      ...mapActions([
        'setFilterEmpty',
        'setSortRemaining'
      ])
    }
  }
</script>

<style lang="scss" scoped>
  @import "~@/assets/style/variables";

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
