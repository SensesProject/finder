<template>
  <div>
    <nav class="filter">
      <header>
        <h2>Filter</h2>
        <span class="reset" @click="resetFilter" v-if="filter.length">Reset Filter</span>
      </header>
      <div class="columns">
        <Facet title="Types" :values="types" ki="type" />
        <Facet title="Properties" :values="properties" ki="properties" />
        <Facet title="Values" :values="values.counting" ki="values" />
        <Facet title="Process" :values="process" ki="process" />
      </div>
    </nav>
    <div class="content">
      <h2>Data</h2>
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
        'filter'
      ]),
      ...mapGetters([
        'types',
        'properties',
        'values',
        'process',
        'result'
      ])
    },
    methods: {
      ...mapActions([
        'resetFilter'
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
  h2 {
    display: inline-block;
  }

  .reset {
    color: #DC3023;
  }

  .filter {
    background-color: #f1f1f1;
    box-shadow: 0 1px 4px 0 rgba(0, 0, 0, 0.14);
    padding: 1rem;
  }

  .content {
    padding: 1rem;
  }
</style>
