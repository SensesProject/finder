<template>
  <div class="groups" :style="{ 'grid-template-columns': `repeat(${columns}, 1fr)`}">
    <div v-for="(options, key) in elements" class="options">
      <header>
        <strong>{{ key }}</strong>
      </header>
      <ul>
        <li v-for="option in options" class="option">
          <input
            v-model="tempVisibleFacets"
            type="checkbox"
            v-bind:value="option.id"
            :id="option.label" />
          <label
            :for="option.label"
            v-html="option.label" />
        </li>
      </ul>
    </div>
    <div v-for="(options, key) in details" class="options">
      <header>
        <strong>{{ key }}</strong>
      </header>
      <ul>
        <li v-for="option in options" class="option">
          <SelectDetails :option="option" />
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
  import { mapState, mapActions } from 'vuex'
  import { get, uniq, map, compact, groupBy, size, keys, filter } from 'lodash'
  import { KEY_FACETS_ALL, KEY_FACETS_VISIBLE, KEY_FILTER, KEY_FILTER_TYPE_DETAILS, SELECTION_YEARS } from '~/store/config'
  import SelectDetails from '~/components/Aside/SelectDetails.vue'

  export default {
    components: {
      SelectDetails
    },
    computed: {
      ...mapState('facets', {
        facets: KEY_FACETS_ALL
      }),
      ...mapState('filter', {
        visibleFacets: KEY_FILTER
      }),
      tempVisibleFacets: {
        get () {
          return keys(this.visibleFacets)
        },
        set (val) {
          this.checkVisibleFacetList(val)
        }
      },
      elements () {
        return groupBy(filter(this.facets, facet => !get(facet, 'system', true) && get(facet, 'type') !== KEY_FILTER_TYPE_DETAILS), 'group')
      },
      details () {
        // console.log(this.facets)
        return groupBy(filter(this.facets, facet => !get(facet, 'system', true) && get(facet, 'type') === KEY_FILTER_TYPE_DETAILS), 'group')
      },
      columns () {
        return size(this.elements) + size(this.details)
      }
    },
    methods: {
      ...mapActions('filter', [
        'checkVisibleFacetList'
      ])
    }
  }
</script>

<style lang="scss" scoped>
  @import "~@/assets/style/global";

  .tooltip[aria-hidden='true'] {
    display: none;
  }

  .groups {
    display: grid;
    grid-auto-flow: column;
    column-gap: $spacing;
    max-width: 1000px;

    .options {
      display: grid;
      grid-auto-flow: row;
      row-gap: 1rem;
      align-content: start;
      list-style: none;
    }

    .option {
      color: getColor(gray, 10);
      font-size: $size-smallest;
      align-self: start;
      display: grid;
      // margin: 0.4rem 0;
      padding: 0.4rem 0;
      grid-column-gap: 0.4rem;
      grid-auto-flow: column;
      grid-template-columns: auto 1fr;
      border-bottom: 1px solid #e4e4e4;
      align-items: start;

      &.option-details {
        grid-template-columns: 1fr auto;
      }

      &:last-child {
        margin-bottom: 0;
        border-bottom: 0;
        padding-bottom: 0;
      }

      input {
        margin-right: $spacing / 6;
        margin-top: 1px;
      }

      label {
        display: block;
        line-height: 1.2;
      }
    }
  }
</style>
