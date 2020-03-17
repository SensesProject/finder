<template>
  <div class="facets">
    <component
      v-for="option in options"
      v-bind:is="option.type"
      v-if="!option.system"
      :tooltip="option.tooltip"
      :title="option.label"
      :options="option.options"
      :values="option.values"
      :id="option.id"
      :key="option.key" />
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'
  // Facet types
  import Facet from '~/components/Facet.vue'
  import Histogram from '~/components/Histogram.vue'
  import Scatterplot from '~/components/Scatterplot.vue'
  import Search from '~/components/Search.vue'

  export default {
    computed: {
      ...mapGetters([
        'options'
      ])
    },
    components: {
      Facet,
      Search,
      Histogram,
      Scatterplot
    }
  }
</script>

<style lang="scss" scoped>
  @import "~@/assets/style/variables";

  .facets {
    display: grid;
    grid-auto-flow: column;
    grid-column-gap: $spacing / 2;
    justify-items: start;
    grid-template-columns: repeat(auto-fill, #{$column-width});

    .facet, .options {
      width: $column-width;
    }
  }
</style>
