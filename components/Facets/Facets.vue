<template>
  <div class="facets">
    <component
      v-for="{ title, id, component, items, tooltip, thresholds, init } in elements"
      v-bind:is="component"
      :key="id"
      :tooltip="tooltip"
      :id="id"
      :title="title"
      :items="items"
      :thresholds="thresholds"
      :init="init" />
  </div>
</template>

<script>
  import { mapState } from 'vuex'
  import { KEY_FACETS_FACETS } from '~/store/config'
  import { map, capitalize } from 'lodash'
  // Facet types
  import List from '~/components/Facets/List.vue'
  import Histogram from '~/components/Facets/Histogram.vue'
  import Scatterplot from '~/components/Facets/Scatterplot.vue'
  import Search from '~/components/Facets/Search.vue'

  export default {
    computed: {
      ...mapState('facets', [
        KEY_FACETS_FACETS
      ]),
      elements () {
        return map(this[KEY_FACETS_FACETS], ({ init, type, items, tooltip, label, thresholds }, id) => {
          const component = capitalize(type)
          const title = label
          return {
            title,
            tooltip,
            id,
            component,
            items,
            thresholds,
            init
          }
        })
      }
    },
    components: {
      List,
      Search,
      Histogram,
      Scatterplot
    }
  }
</script>

<style lang="scss" scoped>
  @import "~@/assets/style/global";

  .facets {
    display: grid;
    grid-auto-flow: column;
    grid-column-gap: $column-gap;
    justify-items: start;
    grid-template-columns: repeat(auto-fill, #{$column-width});

    .facet, .options {
      width: $column-width;
    }
  }
</style>
