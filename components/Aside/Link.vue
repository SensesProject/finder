<template>
  <button
    v-tooltip="'Click to copy link of current filter'"
    class="btn btn--icon clickable"
    @click="copyLink">
    <i class="glyph-finder-export" />
  </button>
</template>

<script>
  import { mapState, mapGetters } from 'vuex'
  import { get, map, isEqual } from 'lodash'
  import copy from 'copy-to-clipboard'

  export default {
    computed: {
      ...mapState({
        displayURL: state => get(state, 'options.displayURL', false)
      }),
      ...mapGetters([
        'url'
      ])
    },
    methods: {
      changeURL () {
        const { displayURL, url } = this
        let query
        if (displayURL) {
          query = url
        } else {
          query = {}
        }
        const current = get(this.$route, 'query', {})
        if (!isEqual(current, query)) {
          this.$router.replace({ query: query })
        }
      },
      copyLink (event) {
        // console.log(this.url)
        const link = map(this.url, (value, key) => {
          return `${key}=${value}`
        }).join('&')
        const getUrl = window.location
        // console.log(this.$router)
        copy(`${getUrl.protocol}//${getUrl.host}${this.$router.options.base}?${encodeURI(link)}`)
      }
    },
    watch: {
      // whenever url changes, this function will run
      url () {
        this.changeURL()
      },
      displayURL () {
        this.changeURL()
      }
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

    .reset.clickable {
      color: #99242e;
    }
  }
</style>
