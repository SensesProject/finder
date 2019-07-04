<template>
  <aside>
    <section class="counter" v-if="false">
      <Loading v-if="data.length === 0 || statusData === 'IDLE' || statusData === 'LOADING'" />
      <span v-else-if="statusAuth === 'AUTH_FAILED' || statusData === 'LOADING_FAILED' || statusData === 'ERROR'">—</span>
    </section>
    <button v-tooltip="'Load data from API instead of cache'" class="btn btn--icon clickable" @click="loadData(true)"><i class="icon-arrows-ccw" /></button>
    <button v-tooltip="'View references for data'" class="btn btn--icon clickable" @click="openInfoBox"><i class="demo-icon icon-info-circled" /></button>
    <v-popover :autoHide="true">
      <button class="btn btn--icon clickable" v-tooltip="'Show display options'"><i class="demo-icon icon-cog" /></button>
      <Options slot="popover"/>
    </v-popover>
    <button :class="{ btn: true, reset: true, clickable: filter.length }" @click="resetFilters"><i class="demo-icon icon-cancel-circled" /> Reset all filter</button>
    <button class="btn" v-tooltip="'Open selected scenarios in IIASA Explorer'"><i class="demo-icon icon-export" /> Open in Explorer</button>
  </aside>
</template>

<script>
  import { mapState, mapGetters, mapActions } from 'vuex'
  import { get } from 'lodash'
  import Options from '~/components/Options.vue'
  import Loading from '~/components/Loading.vue'

  export default {
    computed: {
      ...mapState({
        filter: state => get(state, 'facet.filter', []),
        statusData: state => get(state, 'data.status', 'ERROR'),
        statusAuth: state => get(state, 'auth.status', 'ERROR'),
        data: state => get(state, 'data.data', [])
      }),
      ...mapGetters([
        'result'
      ])
    },
    methods: {
      ...mapActions([
        'resetFilters',
        'openInfoBox',
        'loadData'
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

    .v-popover {
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .reset.clickable {
      color: #99242e;
    }
  }
</style>
