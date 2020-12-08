<template>
  <li class="option">
    <label>{{ option.label }}</label>
    <button class="btn btn--compact" @click="add">Add</button>
  </li>
</template>

<script>
  import { mapState, mapActions } from 'vuex'
  import { get, uniq, map, compact, groupBy, size, keys, filter, uniqueId } from 'lodash'
  import { KEY_FACETS_ALL, KEY_FACETS_VISIBLE, KEY_FILTER, KEY_FILTER_TYPE_DETAILS, REGION_MAPPING, SELECTION_YEARS } from '~/store/config'

  export default {
    name: 'SelectDetails',
    props: {
      option: {
        type: Object
      }
    },
    methods: {
      ...mapActions('filter', [
        'addFacet'
      ]),
      add () {
        this.addFacet(Object.assign(this.option, { id: uniqueId(this.option.id) }))
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import "~@/assets/style/global";

</style>
