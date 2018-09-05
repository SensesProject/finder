<template>
  <div
    class="wrapper">
    <nav class="filter">
      <header>
        <h2>Co-Creation techniques (<span v-if="result.length !== data.length">{{ result.length }}/</span>{{ data.length }} items)</h2>
      </header>
      <div class="columns columns-gutter-narrow facets">
        <Options />
        <Facet
          v-for="option in options"
          :title="option.label"
          :values="option.options"
          :ki="option.key"
          :key="option.key" />
      </div>
    </nav>
    <div class="content">
      <Table />
    </div>
  </div>
</template>

<script>
  import { mapState, mapGetters } from 'vuex'
  import Facet from '~/components/Facet.vue'
  import Table from '~/components/Table.vue'
  import Options from '~/components/Options.vue'

  export default {
    computed: {
      ...mapState([
        'data'
      ]),
      ...mapGetters([
        'result',
        'options'
      ])
    },
    components: {
      Facet,
      Table,
      Options
    }
  }
</script>

<style lang="scss" scoped>
  @import "~@/assets/style/variables";

  .wrapper {
    max-height: 100vh;
    display: flex;
    flex-direction: column;
  }

  .facets {
    justify-content: flex-start;
    display: inline-flex;

    .facet, .options {
      width: calc(#{$column-width});
    }
  }

  .reset {
    color: #DC3023;
  }

  .filter {
    /* Permalink - use to edit and share this gradient: http://colorzilla.com/gradient-editor/#3f4550+0,282f37+100 */
    background: rgb(63,69,80); /* Old browsers */
    background: -moz-linear-gradient(-45deg, rgba(63,69,80,1) 0%, rgba(40,47,55,1) 100%); /* FF3.6-15 */
    background: -webkit-linear-gradient(-45deg, rgba(63,69,80,1) 0%,rgba(40,47,55,1) 100%); /* Chrome10-25,Safari5.1-6 */
    background: linear-gradient(135deg, rgba(63,69,80,1) 0%,rgba(40,47,55,1) 100%); /* W3C, IE10+, FF16+, Chrome26+, Opera12+, Safari7+ */
    filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='#3f4550', endColorstr='#282f37',GradientType=1 ); /* IE6-9 fallback on horizontal gradient */
    box-shadow: 0 1px 4px 0 rgba(0, 0, 0, 0.14);
    padding: 1rem;

    h2 {
      color: rgba(255, 255, 255, 1);
    }
  }

  .content {
    padding: 1rem;
  }
</style>
