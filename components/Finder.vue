<template>
  <div class="wrapper">
    <Header
      :title="title"
      :subtitle="subtitle"
      :showExplorer="showExplorer" />
    <Table />
    <Popover><template v-slot:reference><slot name="reference" /></template></Popover>
  </div>
</template>

<script>
  import { mapState, mapGetters, mapActions } from 'vuex'
  import { get, size, isEqual } from 'lodash'
  import Header from '~/components/Header.vue'
  import Popover from '~/components/Popover.vue'
  import Table from '~/components/Table.vue'

  export default {
    head () {
      return {
        title: this.title
      }
    },
    props: {
      title: {
        type: String,
        default: 'Finder'
      },
      subtitle: {
        type: String,
        default: 'Senses Finder Tool'
      },
      urlData: {
        type: String
      },
      urlAuth: {
        type: String
      },
      id: {
        type: String
      },
      facetsURL: {
        type: String
      },
      isGoogleSheet: {
        type: Boolean,
        default: false
      },
      showExplorer: {
        type: Boolean,
        default: false
      }
    },
    computed: {
      ...mapState([
        'data'
      ]),
      ...mapState({
        displayURL: state => get(state, 'options.displayURL', false)
      }),
      ...mapGetters([
        'url'
      ])
    },
    methods: {
      ...mapActions([
        'setFacets',
        'setUrlData',
        'setUrlAuth',
        'setID',
        'initFilter',
        'loadFacets',
        'setIsGoogleSheet',
        'setUrlFacets',
        'setInitFilter'
      ]),
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
      }
    },
    components: {
      Header,
      Popover,
      Table
    },
    created: function () {
      const initFilter = get(this.$route, 'query', {})
      if (size(initFilter)) {
        this.$router.replace({ params: {} })
      }
      this.setInitFilter(initFilter)
      this.setUrlFacets(this.facetsURL)
      this.setIsGoogleSheet(this.isGoogleSheet)
      this.setID(this.id)
      this.setUrlData(this.urlData)
      if (this.urlAuth) {
        this.setUrlAuth(this.urlAuth)
      }
    },
    watch: {
      // whenever question changes, this function will run
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
  @import "~@/assets/style/variables";

  .wrapper {
    max-height: 100vh;
    display: grid;
    min-width: calc(100vw - #{$spacing});
  }

  .reset {
    color: #DC3023;
  }
</style>
