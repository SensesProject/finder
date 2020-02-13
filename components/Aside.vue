<template>
  <aside>
    <section class="counter" v-if="false">
      <Loading v-if="data.length === 0 || statusData === 'IDLE' || statusData === 'LOADING'" />
      <span v-else-if="statusAuth === 'AUTH_FAILED' || statusData === 'LOADING_FAILED' || statusData === 'ERROR'">—</span>
    </section>
    <button v-tooltip="'Load data from API instead of cache'" class="btn btn--icon clickable" @click="loadData(true)"><i class="icon-arrows-ccw" /></button>
    <button v-tooltip="'View references for data'" class="btn btn--icon clickable" @click="openInfoBox"><i class="icon-info-circled" /></button>
    <v-popover :autoHide="true">
      <button class="btn btn--icon clickable" v-tooltip="'Show display options'"><i class="icon-cog" /></button>
      <Options slot="popover"/>
    </v-popover>
    <v-popover :autoHide="true">
      <button class="btn btn--icon clickable" v-tooltip="'Show facet options'"><i class="icon-list" /></button>
      <SelectFacets slot="popover"/>
    </v-popover>
    <button v-tooltip="'Click to copy link of current filter'" class="btn btn--icon clickable" @click="copyLink"><i class="icon-export" /></button>
    <button :class="{ btn: true, reset: true, clickable: filter.length }" @click="resetFilters"><i class="icon-cancel-circled" /> Reset all filter</button>
    <button class="btn" v-tooltip="'Open selected scenarios in IIASA Explorer'"><i class="icon-export" /> Open in Explorer</button>
  </aside>
</template>

<script>
  import { mapState, mapGetters, mapActions } from 'vuex'
  import { get, map } from 'lodash'
  import Options from '~/components/Options.vue'
  import SelectFacets from '~/components/SelectFacets.vue'
  import Loading from '~/components/Loading.vue'
  import copy from 'copy-to-clipboard'

  export default {
    computed: {
      ...mapState({
        filter: state => get(state, 'filter.filter', []),
        statusData: state => get(state, 'data.status', 'ERROR'),
        statusAuth: state => get(state, 'auth.status', 'ERROR'),
        data: state => get(state, 'data.data', [])
      }),
      ...mapGetters([
        'result',
        'url'
      ])
    },
    methods: {
      ...mapActions([
        'resetFilters',
        'openInfoBox',
        'loadData'
      ]),
      copyLink: function (event) {
        const link = map(this.url, (value, key) => {
          return `${key}=${value}`
        }).join('&')
        const getUrl = window.location
        copy(`${getUrl.protocol}//${getUrl.host}${this.$router.options.base}?${encodeURI(link)}`)
      }
    },
    components: {
      Options,
      SelectFacets,
      Loading
    }
  }
</script>

<style lang="scss" scoped>
  @import "~@/assets/style/variables";

  aside {
    display: flex;
    max-height: 40px;
    overflow-y: hidden;

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
