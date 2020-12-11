<template>
  <nav class="navigation">
    <header class="header">
      <h1 class="page-title">{{ title }}</h1>
      <slot />
      <Aside :showExplorer="showExplorer" />
    </header>
  </nav>
</template>

<script>
  import Aside from '~/components/Aside/Aside.vue'

  export default {
    props: ['title', 'subtitle', 'showExplorer'],
    components: {
      Aside
    }
  }
</script>

<style lang="scss">
  @import "~@/assets/style/global";

  .navigation {
    padding: $spacing / 2;
    display: grid;
    grid-template-rows: auto auto;
    grid-row-gap: $spacing / 2;

    .header {
      display: grid;
      grid-template-columns: 1fr;
      grid-auto-flow: row;
      align-items: center;
      grid-column-gap: $spacing;
      grid-row-gap: $spacing;
      justify-content: space-between;
      width: calc(100vw - #{$spacing});
      align-items: start;

      @include media-query($medium) {
        grid-template-columns: repeat(2, auto);

        .page-description {
          grid-row-start: 2;
          grid-column-end: span 2;
        }
      }

      @include media-query(#{$facet-width * 6}) {
        grid-template-columns: $facet-width auto auto;

        .page-description {
          grid-row-start: auto;
          grid-column-end: span 1;
        }
      }

      @include media-query(#{$facet-width * 7}) {
        grid-template-columns: $facet-width auto auto;
      }
    }

    h1, h2, h3 {
      display: inline-block;
    }

    h2 {
      color: $color-default;
    }

    p {
      font-size: $size-smaller;

      i {
        font-size: 0.8em;
      }
    }
  }
</style>
