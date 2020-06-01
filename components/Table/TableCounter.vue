<template>
  <div><span v-if="countFiltered !== countTotal">{{ countFiltered }}/</span><span>{{ countTotal }} {{ label }}{{ countTotal === 1 ? '' : 's' }}</span></div>
</template>

<script>
  import { mapState } from 'vuex'
  import { get } from 'lodash'

  export default {
    props: {
      label: {
        type: String,
        default: 'item'
      }
    },
    computed: {
      ...mapState('datum', [
        'count',
        'numberOfPages'
      ]),
      countFiltered () {
        return get(this.count, 0)
      },
      countTotal () {
        return get(this.count, 1)
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import "~@/assets/style/global";

</style>
