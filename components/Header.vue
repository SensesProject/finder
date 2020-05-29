<template>
  <nav class="navigation">
    <header class="header">
      <h1>{{ title }}</h1>
      <slot />
      <Aside :showExplorer="showExplorer" />
    </header>
    <Facets />
  </nav>
</template>

<script>
  import Aside from '~/components/Aside/Aside.vue'
  import Facets from '~/components/Facets/Facets.vue'

  export default {
    props: ['title', 'subtitle', 'showExplorer'],
    components: {
      Aside,
      Facets
    }
  }
</script>

<style lang="scss" scoped>
  @import "~@/assets/style/global";

  $navigation-height: 50px;

  .navigation {
    background-color: $color-bg-header;
    border-bottom: 1px solid $color-border-header;
    padding: $spacing / 2;
    display: grid;
    grid-template-rows: auto auto;
    grid-row-gap: $spacing / 2;

    .header {
      display: grid;
      grid-auto-flow: column;
      grid-template-columns: auto auto;
      align-items: center;
      grid-column-gap: $spacing;
      justify-content: space-between;
      width: calc(100vw - #{$spacing});
      align-items: start;

      @include media-query($wide) {
        grid-template-columns: calc(#{$facet-width * 1.5}) calc(#{$facet-width * 3.5} + #{$spacing * 2}) 1fr;
      }
    }

    h1, h2, h3 {
      display: inline-block;
    }

    h2 {
      color: $color-black;
    }

    p {
      font-size: $size-smaller;

      i {
        font-size: 0.8em;
      }
    }
  }
</style>
