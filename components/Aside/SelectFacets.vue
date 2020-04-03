<template>
  <ul class="options" :style="{ 'grid-template-columns': `repeat(${columns.length}, 1fr)` }">
    <li v-for="header in headers" :style="{ 'grid-column-start': header.position }">
      <strong>{{ header.label }}</strong>
    </li>
    <li v-for="facet in elements" :style="{ 'grid-column-start': facet.position }">
      <input
        v-model="tempVisibleFacets"
        type="checkbox"
        v-bind:value="facet.id"
        :id="facet.label" />
      <label
        :for="facet.label"
        v-html="facet.label" />
    </li>
  </ul>
</template>

<script>
  import { mapState, mapActions } from 'vuex'
  import { get, uniq, map, compact } from 'lodash'

  export default {
    computed: {
      ...mapState({
        visibleFacets: state => state.facets.visibleFacets,
        facets: state => get(state, 'facets.facets', [])
      }),
      tempVisibleFacets: {
        get: function () {
          return this.visibleFacets
        },
        set: function (val) {
          this.setVisibleFacets(val)
        }
      },
      columns () {
        return uniq(compact(map(this.facets, (facet) => { return get(facet, 'system', true) ? false : get(facet, 'group', false) })))
      },
      headers () {
        return map(this.columns, (column, i) => {
          return {
            position: i + 1,
            label: column
          }
        })
      },
      elements () {
        return compact(map(this.facets, facet => {
          if (get(facet, 'system', true)) return false
          const position = this.columns.indexOf(facet.group) + 1
          return {
            position,
            ...facet
          }
        }))
      }
    },
    methods: {
      ...mapActions([
        'setVisibleFacets'
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
    display: grid;
    grid-auto-flow: column;
    grid-gap: $spacing / 4 $spacing;
    max-width: 1000px;

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
