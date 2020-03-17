<template>
  <div class="wrapper">
    <Header
      :title="title"
      :subtitle="subtitle"
      :showExplorer="showExplorer" />
    <Table />
    <Popover><slot name="reference" /></Popover>
  </div>
</template>

<script>
  import { mapActions } from 'vuex'
  import { get, size } from 'lodash'
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
      ])
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
