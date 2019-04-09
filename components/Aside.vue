<template>
  <aside>
    <span class="counter">{{ status }}</span>
    <v-popover offset="4">
      <button class="btn clickable" v-tooltip="{ delay: { show: 0, hide: 1000 }, autoHide: true, trigger: 'click', closeOnClickOutside: true }">Options</button>
      <template slot="popover">
        <Options />
      </template>
    </v-popover>
    <span class="counter"><span v-if="result.length !== data.length">{{ result.length }}/</span>{{ data.length }} items</span>
    <span :class="{ btn: true, reset: true, clickable: filter.length }" @click="resetFilter">Reset all filter</span>
  </aside>
</template>

<script>
  import { mapState, mapGetters, mapActions } from 'vuex'
  import Options from '~/components/Options.vue'
  import { get } from 'lodash'

  export default {
    computed: {
      ...mapState([
        'filter'
      ]),
      ...mapState({
        status: state => get(state, 'data.status', 'ERROR'),
        data: state => get(state, 'data.data', [])
      }),
      ...mapGetters([
        'result'
      ])
    },
    methods: {
      ...mapActions([
        'resetFilter'
      ])
    },
    components: {
      Options
    }
  }
</script>

<style lang="scss" scoped>
  @import "~@/assets/style/variables";

  aside {
    & > * {
      display: inline-block;
      text-align: center;
      margin: 0 $spacing / 2;

      &.counter {
        min-width: 120px;
      }

      &:first-child {
        margin-left: 0;
      }

      &:last-child {
        margin-right: 0;
      }
    }

    * {
      font-size: $size-smaller !important;
    }
  }
</style>
