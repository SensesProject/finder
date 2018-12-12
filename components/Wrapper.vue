<template>
  <div class="wrapper">
    <nav class="filter">
      <header>
        <h2>{{ title }} <small>(<span v-if="result.length !== data.length">{{ result.length }}/</span>{{ data.length }} items)</small></h2>
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
    <Popover />
  </div>
</template>

<script>
  import { mapState, mapGetters, mapActions } from 'vuex'
  import Facet from '~/components/Facet.vue'
  import Table from '~/components/Table.vue'
  import Options from '~/components/Options.vue'
  import Popover from '~/components/Popover.vue'

  export default {
    props: ['title', 'file', 'facets'],
    computed: {
      ...mapState([
        'data',
        'popover'
      ]),
      ...mapGetters([
        'result',
        'options'
      ])
    },
    methods: {
      ...mapActions([
        'setContent'
      ])
    },
    components: {
      Facet,
      Table,
      Options,
      Popover
    },
    created: function () {
      this.setContent({ data: this.file, facets: this.facets })
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
    background-color: palette(grey, 90);
    border-bottom: 1px solid palette(grey, 85);
    // box-shadow: 0 1px 4px 0 rgba(0, 0, 0, 0.14);
    padding: 1rem;

    h2 {
      color: palette(grey, 0);
    }
  }

  .content {
    padding: 1rem 0;
  }
</style>
