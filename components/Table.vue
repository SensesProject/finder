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
        <td>{{ n }}</td>
        <td v-for="key in header">{{ row[key] }}</td>
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
  import { mapGetters } from 'vuex'

  export default {
    props: ['data'],
    computed: {
      ...mapGetters([
        'header'
      ])
    }
  }
</script>

<style lang="scss" scoped>
  th {
    text-align: left;
  }

  .message {
    text-align: center;
  }
</style>
