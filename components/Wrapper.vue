<template>
  <div class="wrapper">
    <nav class="navigation">
      <header class="header">
        <hgroup>
          <h1>{{ title }}</h1>
          <h2>{{ subtitle }}</h2>
        </hgroup>
        <Aside />
      </header>
      <div class="facets">
        <component
          v-for="option in options"
          v-bind:is="option.type"
          :tooltip="option.tooltip"
          :title="option.label"
          :options="option.options"
          :values="option.values"
          :id="option.id"
          :key="option.key" />
      </div>
    </nav>
    <div class="content">
      <Table />
    </div>
    <Popover><template v-slot:reference><slot name="reference" /></template></Popover>
  </div>
</template>

<script>
  import { mapState, mapGetters, mapActions } from 'vuex'
  import { get, size, map, kebabCase, isEqual } from 'lodash'
  import Aside from '~/components/Aside.vue'
  import Popover from '~/components/Popover.vue'
  import Table from '~/components/Table.vue'

  // Facet types
  import Facet from '~/components/Facet.vue'
  import Histogram from '~/components/Histogram.vue'
  import Scatterplot from '~/components/Scatterplot.vue'
  import Search from '~/components/Search.vue'

  export default {
    props: ['title', 'subtitle', 'facets', 'urlData', 'urlAuth', 'id'],
    computed: {
      ...mapState([
        'data'
      ]),
      ...mapState({
        displayURL: state => get(state, 'options.displayURL', false)
      }),
      ...mapGetters([
        'options',
        'url'
      ])
    },
    methods: {
      ...mapActions([
        'setFacets',
        'setUrlData',
        'setUrlAuth',
        'setID',
        'initFilter'
      ]),
      changeURL () {
        const { displayURL, url } = this
        let query
        if (displayURL) {
          query = url
        } else {
          query = {}
        }
        const current = get(this.$route, 'query', {})
        if (!isEqual(current, query)) {
          this.$router.replace({ query: query })
        }
      }
    },
    components: {
      Aside,
      Facet,
      Popover,
      Search,
      Table,
      Histogram,
      Scatterplot
    },
    created: function () {
      this.setID(this.id)
      this.setUrlData(this.urlData)
      if (this.urlAuth) {
        this.setUrlAuth(this.urlAuth)
      }
      this.setFacets(map(this.facets, facet => {
        return {
          ...facet,
          id: kebabCase(get(facet, 'label')) // Used for the url
        }
      }))
      const query = get(this.$route, 'query', {})
      if (size(query)) {
        this.$router.replace({ params: {} })
        this.initFilter(query)
      }
    },
    watch: {
      // whenever question changes, this function will run
      url () {
        this.changeURL()
      },
      displayURL () {
        this.changeURL()
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import "~@/assets/style/variables";

  .wrapper {
    max-height: 100vh;
    display: grid;
    min-width: calc(100vw - #{$spacing});
  }

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

  .reset {
    color: #DC3023;
  }

  $navigation-height: 50px;

  .navigation {
    background-color: palette(grey, 90);
    border-bottom: 1px solid palette(grey, 85);
    padding: $spacing / 2;
    display: grid;
    grid-template-rows: $navigation-height auto;
    grid-row-gap: $spacing / 2;

    .header {
      display: grid;
      grid-auto-flow: column;
      grid-template-columns: $column-width * 3 auto;
      align-items: center;
      grid-column-gap: $spacing / 2;
      justify-content: space-between;
      width: calc(100vw - #{$spacing});
    }

    h1, h2, h3 {
      display: inline-block;
    }

    h2 {
      color: palette(grey, 0);
    }
  }

  .content {
    padding: 0 0 1rem;
  }
</style>
