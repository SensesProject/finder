<template>
  <table>
    <thead>
      <tr>
        <th>#</th>
        <th v-for="key in header">{{ key }}</th>
      </tr>
    </thead>
    <tbody v-if="data.length">
      <tr
        v-for="(row, n) in data">
        <td>{{ n + 1 }}</td>
        <td v-for="key in header">{{ isArray(row[key]) ? row[key].join(', ') : row[key] }}</td>
      </tr>
    </tbody>
    <tbody v-else>
      <tr>
        <td class="message" :colspan="header.length + 1">No item found</td>
      </tr>
    </tbody>
  </table>
</template>

<script>
  import { mapState } from 'vuex'
  import _ from 'lodash'

  export default {
    props: ['data'],
    computed: {
      ...mapState([
        'header'
      ])
    },
    methods: {
      isArray: _.isArray
    }
  }
</script>

<style lang="scss" scoped>
  @import "~@/assets/style/variables";

  table {
    line-height: 1.2;
    font-size: $size-smallest;
  }

  th {
    text-align: left;
    padding: 0 0.1em;
  }

  tbody tr:hover {
    color: #E38A73;
  }

  tr td {
    border-bottom: 1px solid $color-bg-mute;
    padding: $spacing / 4 0.1em;
  }

  .message {
    text-align: center;
  }
</style>
