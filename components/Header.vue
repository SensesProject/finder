<template>
  <nav class="navigation">
    <header class="header">
      <hgroup>
        <h1>{{ title }}</h1>
        <h2>{{ subtitle }}</h2>
      </hgroup>
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
    grid-template-rows: $navigation-height auto;
    grid-row-gap: $spacing / 2;

    .header {
      display: grid;
      grid-auto-flow: column;
      grid-template-columns: auto auto;
      align-items: center;
      grid-column-gap: $spacing / 2;
      justify-content: space-between;
      width: calc(100vw - #{$spacing});

      @include media-query($wide) {
        grid-template-columns: $column-width * 3 auto;
      }

      hgroup {
        display: flex;
        flex-direction: column;

        @include media-query($wide) {
          align-items: flex-end;
          flex-direction: row;
        }
      }
    }

    h1, h2, h3 {
      display: inline-block;
    }

    h2 {
      color: $color-black;
    }
  }
</style>
