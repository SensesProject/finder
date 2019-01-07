<template>
  <ul class="options">
    <li><input v-model="optionsFilterProp" id="optionsFilter" type="checkbox" /> <label for="optionsFilter">Hide empty options</label></li>
    <li><input v-model="sortRemainingProp" id="sortRemaining" type="checkbox" /> <label for="sortRemaining">Sort by remaining amount</label></li>
  </ul>
</template>

<script>
  import { mapState, mapActions } from 'vuex'

  export default {
    computed: {
      ...mapState([
        'filter',
        'optionsFilter',
        'sortRemaining'
      ]),
      optionsFilterProp: {
        get () {
          return this.optionsFilter
        },
        set (value) {
          this.setOptionsFilter({ value })
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
        'resetFilter',
        'setOptionsFilter',
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
