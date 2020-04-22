<template>
  <div class="groups" :style="{ 'grid-template-columns': `repeat(${columns}, 1fr)`}">
    <ul v-for="(options, key) in elements" class="options">
      <li><strong>{{ key }}</strong></li>
      <li v-for="option in options" :style="{ 'grid-column-start': option.position }">
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
</template>

<script>
  import { mapState, mapActions } from 'vuex'
  import { get, uniq, map, compact, groupBy, size, keys, filter } from 'lodash'
  import { KEY_FACETS_ALL, KEY_FACETS_VISIBLE, KEY_FILTER } from '~/store/config'

  export default {
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
        return groupBy(filter(this.facets, facet => !get(facet, 'system', true)), 'group')
      },
      columns () {
        return size(this.elements)
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
      row-gap: $spacing / 2;
      align-content: start;
    }

    li {
      color: getColor(gray, 10);
      font-size: $size-smallest;
      align-self: start;
      display: flex;

      &:last-child {
        margin-bottom: 0;
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
