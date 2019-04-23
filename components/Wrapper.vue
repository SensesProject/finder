<template>
  <div class="wrapper">
    <nav class="filter">
      <header>
        <hgroup>
          <h1>{{ title }}</h1>
          <h2>{{ subtitle }}</h2>
        </hgroup>
        <Aside />
      </header>
      <div class="columns columns-gutter-narrow facets">
        <component
          v-bind:is="option.title ? 'Search' : 'Facet'"
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
  import Aside from '~/components/Aside.vue'
  import Facet from '~/components/Facet.vue'
  import Popover from '~/components/Popover.vue'
  import Search from '~/components/Search.vue'
  import Table from '~/components/Table.vue'

  export default {
    props: ['title', 'subtitle', 'file', 'facets', 'popovers'],
    computed: {
      ...mapState([
        'data'
      ]),
      ...mapGetters([
        'options'
      ])
    },
    methods: {
      ...mapActions([
        'setContent'
      ])
    },
    components: {
      Aside,
      Facet,
      Popover,
      Search,
      Table
    },
    created: function () {
      this.setContent({ data: this.file, facets: this.facets, popovers: this.popovers })
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

    header {
      width: calc(100vw - 2rem);
      display: flex;
      align-items: center;
      margin-bottom: $spacing / 2;
      justify-content: space-between;
    }

    h1, h2, h3 {
      display: inline-block;
    }

    h2 {
      color: palette(grey, 0);
    }
  }

  .content {
    padding: 1rem 0;
  }
</style>
