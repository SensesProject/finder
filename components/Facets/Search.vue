<template>
  <section
    class="facet"
    @mouseenter="setHoverKey({ id })"
    @mouseleave="resetHoverKey()">
    <FacetHeader
      :id="id"
      :isInvert="isInvert"
      :isActive="isActive"
      :title="title"
      :number="number"
      :tooltip="tooltip" />
    <div><input type="text" :class="{ active: isActive }" placeholder="Search …" v-model="inputTerm" :disabled="status !== 'LOADING_SUCCESS'" /></div>
  </section>
</template>

<script>
  import { mapState, mapActions } from 'vuex'
  import { isUndefined, find, get, size, trim } from 'lodash'
  import FacetHeader from '~/components/Facets/FacetHeader.vue'

  export default {
    props: ['title', 'values', 'id', 'options', 'tooltip'],
    data: function () {
      return {
        term: ''
      }
    },
    computed: {
      ...mapState({
        status: state => get(state, 'data.status', 'ERROR')
      }),
      ...mapState([
        'filter'
      ]),
      isInvert () {
        const keys = find(this.filter, ['id', this.id])
        return isUndefined(keys) ? false : keys.invert
      },
      isActive () {
        return this.term.length
      },
      number () {
        return size(this.options)
      },
      inputTerm: {
        get () {
          return this.term
        },
        set (input) {
          const value = trim(input)
          this.term = value
          if (value.length) {
            this.setFilter({ id: this.id, value: value })
          } else {
            this.resetSearch()
          }
        }
      }
    },
    methods: {
      ...mapActions([
        'resetFilter',
        'setFilter',
        'setHoverKey',
        'resetHoverKey',
        'invertFilter'
      ]),
      resetSearch: function () {
        this.term = ''
        this.resetFilter(this.id)
      }
    },
    components: {
      FacetHeader
    }
  }
</script>

<style lang="scss" scoped>
  @import "~@/assets/style/variables";

  header {
    color: palette(grey, 60);
    margin-bottom: 0;

    h3 {
      text-transform: capitalize;
    }

    span {
      font-size: $size-smallest;

      &.spacer {
        display: inline-block;
        margin: 0 0.2em;
      }

      &.active {
        color: palette(grey, 10);
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

  input {
    background-color: #fff;
    padding: 0.5rem;
    border: 1px solid palette(grey, 80);
    border-radius: $radius-default;
    box-shadow: inset 0 1px 1px 0 rgba(0, 0, 0, 0.05);
    overflow-y: scroll;
    height: calc(1.5rem * 1);
    outline: none;
    width: 100%;
    transition: 0.3s;
    font-size: $size-smallest;
    color: palette(grey, 20);

    &:hover {
      color: palette(grey, 0);
    }

    &:focus {
      border-color: palette(grey, 70);
      color: palette(grey, 0);
    }

    &.active {
      font-weight: bold;
      color: $color-green;
    }

    &[disabled] {
      opacity: 0.5;
    }
  }
</style>
