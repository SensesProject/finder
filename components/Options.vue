<template>
  <section
    class="options">
    <header>
      <section>
        <h3>Options</h3>
      </section>
      <section>
        <span class="reset tag" @click="resetFilter" v-if="filter.length">Reset all filter</span>
      </section>
      <ul class="options">
        <li><input v-model="optionsFilterProp" id="optionsFilter" type="checkbox" /> <label for="optionsFilter">Hide empty options</label></li>
        <li><input v-model="sortRemainingProp" id="sortRemaining" type="checkbox" /> <label for="sortRemaining">Sort by remaining amount</label></li>
      </ul>
    </header>
  </section>
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

  .options {
    li {
      color: palette(grey, 10);
      font-size: $size-smallest;
      margin-right: $spacing / 2;

      input {
        margin-right: $spacing / 6;
      }
    }
  }

  header {
    color: rgba(255, 255, 255, 0.6);
    margin-bottom: 0;

    span {
      font-size: $size-smallest;

      &.spacer {
        display: inline-block;
        margin: 0 0.2em;
      }

      &.active {
        color: rgb(255, 255, 255);
      }
    }

    section {
      display: flex;
      justify-content: space-between;
      align-items: center;

      &:first-child {
        min-height: 2rem;
      }
    }
  }
</style>
