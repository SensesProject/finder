<template>
  <div
    class="wrapper">
    <nav class="filter">
      <header>
        <h2>Filter</h2>
        <span class="reset tag" @click="resetFilter" v-if="filter.length">Reset all filter</span> <input v-model="optionsFilterProp" id="optionsFilter" type="checkbox" /> <label for="optionsFilter">Hide empty options</label>
      </header>
      <div class="columns columns-gutter-narrow facets">
        <Facet
          v-for="option in options"
          :title="option.label"
          :values="option.options"
          :ki="option.key"
          :key="option.key" />
<!--         <Facet title="Properties" :values="properties" ki="properties" />
        <Facet title="Values" :values="values.counting" ki="values" />
        <Facet title="Process" :values="process" ki="process" /> -->
      </div>
    </nav>
    <div class="content">
      <h2>Data <span v-if="result.length !== data.length">({{ result.length }}/{{ data.length }})</span></h2>
      <Table :data="result" />
    </div>
  </div>
</template>

<script>
  import { mapState, mapGetters, mapActions } from 'vuex'
  import Facet from '~/components/Facet.vue'
  import Table from '~/components/Table.vue'

  export default {
    computed: {
      ...mapState([
        'filter',
        'data',
        'optionsFilter'
      ]),
      ...mapGetters([
        'types',
        'properties',
        'values',
        'process',
        'result',
        'options'
      ]),
      optionsFilterProp: {
        get () {
          return this.optionsFilter
        },
        set (value) {
          console.log(value)
          this.setOptionsFilter({ value })
        }
      }
    },
    methods: {
      ...mapActions([
        'resetFilter',
        'setOptionsFilter'
      ])
    },
    directives: {
    },
    components: {
      Facet,
      Table
    }
  }
</script>

<style lang="scss" scoped>
  .wrapper {
    max-height: 100vh;
    display: flex;
    flex-direction: column;
  }

  .facets {
    justify-content: flex-start;
    display: inline-flex;
  }

  h2 {
    display: inline-block;
    font-weight: bold;
  }

  .reset {
    color: #DC3023;
  }

  .content {
    // width: 8400px;
    // overflow: scroll;
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
