<template>
  <div class="facet facet-search">
    <FacetHeader
      :title="title"
      :isFiltered="isFiltered"
      :isInverted="isInverted"
      :tooltip="tooltip"
      :count="count"
      @removeFacet="() => removeFacet(id)"
      @toggleInvert="toggleInvert"
      @reset="reset" />
    <input
      type="text"
      :class="['search-search', { isActive: isFiltered }]"
      placeholder="Search …"
      v-model="inputTerm" />
  </div>
</template>

<script>
  import { mapActions } from 'vuex'
  import { trim } from 'lodash'
  import FacetHeader from './FacetHeader.vue'

  const TERM_DEFAULT = ''
  const INVERTED_DEFAULT = false

  export default {
    name: 'FacetSearch',
    props: {
      items: {
        type: Array,
        default: () => []
      },
      title: {
        type: String
      },
      id: {
        type: String
      },
      tooltip: {
        type: String
      }
    },
    components: {
      FacetHeader
    },
    data: function () {
      return {
        term: TERM_DEFAULT, // List of selected items
        isInverted: INVERTED_DEFAULT // Is the search inverted
      }
    },
    computed: {
      isFiltered () {
        return this.term !== TERM_DEFAULT
      },
      inputTerm: {
        get () {
          return this.term
        },
        set (input) {
          this.term = input
          this.apply()
        }
      },
      count () {
        // Count the number of options
        return this.items.length
      }
    },
    methods: {
      ...mapActions('filter', [
        'filter',
        'removeFacet',
        'resetFilter'
      ]),
      toggleInvert () {
        this.isInverted = !this.isInverted
        this.apply()
      },
      reset () {
        this.term = TERM_DEFAULT
        this.apply()
      },
      apply () {
        const value = trim(this.term)

        if (value !== '') {
          this.filter({ key: this.id, value: value.toUpperCase(), isInverted: this.isInverted })
        } else {
          this.resetFilter(this.id)
        }
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import "~@/assets/style/global";

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
