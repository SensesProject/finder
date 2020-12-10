<template>
  <button :class="['btn', 'btn--light']" v-tooltip="{ content: 'Download selection as CSV file', placement: 'bottom' }" @click="downloadCSV"><i class="icon-export" /> Download CSV</button>
</template>

<script>
  import { mapState } from 'vuex'
  import { get, map, compact } from 'lodash'
  import { basket } from '~/store/index'
  import { KEY_FILTER } from '~/store/config'

  export default {
    computed: {
      ...mapState('datum', [
        'datum'
      ]),
      ...mapState('filter', {
        filter: KEY_FILTER
      })
    },
    methods: {
      downloadCSV () {
        const filters = sortBy(map(this.filter), 'i')
        const rows = map(basket.allFiltered(), (row) => {
          return map(filters, (filter) => {
            return get(datum, filter[KEY_PATH], '–')
          })
        })
        console.log(this.filter)
        console.log(basket.allFiltered())
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import "~@/assets/style/global";

</style>
