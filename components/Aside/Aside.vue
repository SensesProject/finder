<template>
  <aside>
    <section class="counter" v-if="false">
      <Loading v-if="data.length === 0 || statusData === 'IDLE' || statusData === 'LOADING'" />
      <span v-else-if="statusAuth === 'AUTH_FAILED' || statusData === 'LOADING_FAILED' || statusData === 'ERROR'">—</span>
    </section>
    <button v-tooltip="'Load data from API instead of cache'" class="btn btn--light btn--icon clickable" @click="hardReload" ref="hardReload"><i class="glyph-finder-arrows-ccw" /></button>
    <button v-tooltip="'View references for data'" class="btn btn--light btn--icon clickable" @click="openInfoBox"><i class="glyph-finder-info-circled" /></button>
    <!-- <v-popover :autoHide="true">
      <button class="btn btn--light btn--icon clickable" v-tooltip="'Show display options'"><i class="glyph-finder-cog" /></button>
      <Options slot="popover"/>
    </v-popover> -->
    <button v-tooltip="'Click to copy link of current filter'" class="btn btn--light btn--icon clickable" @click="copyLink"><i class="glyph-finder-export" /></button>
    <v-popover :autoHide="true">
      <button class="btn btn--light clickable" v-tooltip="'Show facet options'"><i class="glyph-finder-list" /> Select facets</button>
      <SelectFacets slot="popover"/>
    </v-popover>
    <button :class="['btn', 'btn--light', 'reset', { hasActiveFilters }]" :disabled="!hasActiveFilters" @click="resetFilters"><i class="glyph-finder-cancel-circled" /> Reset all filter</button>
    <ExplorerLink v-if="showExplorer" />
  </aside>
</template>

<script>
  import { mapState, mapGetters, mapActions } from 'vuex'
  import { get, forEach, isArray } from 'lodash'
  import Options from '~/components/Aside/Options.vue'
  import SelectFacets from '~/components/Aside/SelectFacets.vue'
  import Loading from '~/components/Loading.vue'
  import ExplorerLink from '~/components/Aside/ExplorerLink.vue'
  import copy from 'copy-to-clipboard'
  import { KEY_FILTER, KEY_HAS_ACTIVE_FILTERS } from '~/store/config'

  export default {
    props: {
      showExplorer: {
        type: Boolean,
        default: false
      }
    },
    computed: {
      ...mapState({
        statusData: state => get(state, 'data.status', 'ERROR'),
        statusAuth: state => get(state, 'auth.status', 'ERROR'),
        data: state => get(state, 'data.data', [])
      }),
      ...mapState('facets', {
        hasActiveFilters: [KEY_HAS_ACTIVE_FILTERS]
      }),
      ...mapState('filter', {
        filter: [KEY_FILTER]
      }),
      ...mapGetters([
        'result',
        'url'
      ])
    },
    methods: {
      ...mapActions([
        'openInfoBox',
        'loadData',
        'loadFacets'
      ]),
      ...mapActions('filter', [
        'resetFilters'
      ]),
      ...mapActions('load', [
        'loadData'
      ]),
      ...mapActions('facets', [
        'loadFacets'
      ]),
      copyLink () {
        let link = []
        forEach(this.filter, ({ value, id }) => {
          if (value) {
            const values = isArray(value) ? value.join('|') : value
            link.push(`${id}=${values}`)
          }
          // TODO: add inverted
        })
        const getUrl = window.location
        copy(`${getUrl.protocol}//${getUrl.host}${this.$router.options.base}?${encodeURI(link.join('&'))}`)
      },
      hardReload (event) {
        event.currentTarget.blur()
        this.loadFacets(true)
        this.loadData(true)
      }
    },
    components: {
      Options,
      SelectFacets,
      Loading,
      ExplorerLink
    }
  }
</script>

<style lang="scss" scoped>
  @import "~@/assets/style/global";

  aside {
    display: grid;
    max-height: 40px;
    grid-auto-flow: column;
    grid-column-gap: $spacing / 6;

    @include media-query($narrow) {
      grid-column-gap: $spacing / 4;
    }

    @include media-query($medium) {
      grid-column-gap: $spacing / 6;
    }

    @include media-query($wide) {
      grid-column-gap: $spacing / 2;
    }

    & > * {
      display: inline-block;
      text-align: center;

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

    .reset.hasActiveFilters {
      color: $color-accent;
    }
  }
</style>
