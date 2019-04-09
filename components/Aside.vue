<template>
  <aside>
    <v-popover offset="4">
      <button class="btn clickable" v-tooltip="{ delay: { show: 0, hide: 1000 }, autoHide: true, trigger: 'click', closeOnClickOutside: true }">Options</button>
      <template slot="popover">
        <Options />
      </template>
    </v-popover>
    <section class="counter">
      <Loading v-if="status !== 'LOADING_SUCCESS'" />
      <span v-else-if="status === 'AUTH_FAILED' || status === 'LOADING_FAILED' || status === 'ERROR'">—</span>
      <div v-else>
        <span v-if="result.length !== data.length">{{ result.length }}/</span><span>{{ data.length }} items</span>
      </div>
    </section>
    <span :class="{ btn: true, reset: true, clickable: filter.length }" @click="resetFilter">Reset all filter</span>
  </aside>
</template>

<script>
  import { mapState, mapGetters, mapActions } from 'vuex'
  import { get } from 'lodash'
  import Options from '~/components/Options.vue'
  import Loading from '~/components/Loading.vue'

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
      Options,
      Loading
    }
  }
</script>

<style lang="scss" scoped>
  @import "~@/assets/style/variables";

  aside {
    display: flex;

    & > * {
      display: inline-block;
      text-align: center;
      margin: 0 $spacing / 2;

      &.counter {
        min-width: 120px;

        & > * {
          max-height: 35px;
          width: auto;
          height: 100%;
          vertical-align: middle;
        }

        & span {
          line-height: 35px;
        }
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

    .reset.clickable {
      color: #99242e;
    }
  }
</style>
