<template>
  <div class="facets">
    <section v-for="(number, key) in categories" :style="{ 'grid-column-end': `span ${number}`}" class="group">
      <h4>{{ key }}</h4>
    </section>
    <component
      v-for="({ title, id, component, items, tooltip, thresholds, init, forcedValue, unit, year, region, regions, key, type, uniqID }) in elements"
      v-bind:is="component"
      :key="uniqID"
      :uniqID="uniqID"
      :unit="unit"
      :tooltip="tooltip"
      :id="id"
      :title="title"
      :items="lists[id]"
      :thresholds="thresholds"
      :init="init"
      :forcedValue="forcedValue"
      :year="year"
      :region="region"
      :regions="regions"
      :path="key"
      :type="type" />
  </div>
</template>

<script>
  import { mapState } from 'vuex'
  import { KEY_UNIQ_ID, KEY_FACETS_FACETS, KEY_FILTER } from '~/store/config'
  import { map, capitalize, sortBy, groupBy, fromPairs } from 'lodash'
  // Facet types
  import List from '~/components/Facets/List.vue'
  import Histogram from '~/components/Facets/Histogram.vue'
  import Search from '~/components/Facets/Search.vue'

  export default {
    computed: {
      ...mapState('facets', {
        lists: KEY_FACETS_FACETS
      }),
      ...mapState('filter', {
        filters: KEY_FILTER
      }),
      elements () {
        return sortBy(map(this.filters, ({ init, type, tooltip, label, thresholds, forcedValue, unit, i, group, year, region, regions, key, [KEY_UNIQ_ID]: uniqID }, id) => {
          const component = capitalize(type === 'Details' ? 'Histogram' : type)
          return {
            uniqID,
            title: label,
            type,
            tooltip,
            id,
            i,
            component,
            thresholds,
            init,
            forcedValue,
            unit,
            group,
            year,
            region,
            regions,
            key
          }
        }), 'i')
      },
      categories () {
        return fromPairs(map(groupBy(this.elements, 'group'), (list, key) => [key, list.length]))
      }
    },
    components: {
      List,
      Search,
      Histogram
    }
  }
</script>

<style lang="scss" scoped>
  @import "~@/assets/style/global";

  .facets {
    display: grid;
    grid-column-gap: $facet-gap;
    justify-items: stretch;
    grid-template-columns: repeat(auto-fill, #{$facet-width});
    padding: 1rem;
    background-color: $color-bg-header;
    border-bottom: 1px solid $color-border-header;
    border-top: 1px solid $color-border-header;

    .facet, .options {
      width: $facet-width;
    }

    .facet {
      grid-row-start: 2;
      height: 330px;
      display: grid;
      grid-template-rows: 1fr 250px;
    }

    .group {
      justify-items: stretch;
      align-self: end;

      h4 {
        border-bottom: 1px solid rgba(0, 0, 0, .2);
        font-size: $size-smaller;
        color: rgba(0, 0, 0, .4);
        text-transform: uppercase;
        letter-spacing: 0.05em;
        margin-bottom: $facet-gap / 4;
        padding-bottom: $facet-gap / 8;
        width: 100%;
        font-weight: normal;
        display: block;
        line-height: 1.2;
      }
    }
  }
</style>
