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
      title: { // Title that is displayed in the header and in the title
        type: String,
        default: 'Finder'
      },
      subtitle: { // Subtitle that is displayed in the header
        type: String,
        default: 'Senses Finder Tool'
      },
      urlData: {
        type: String
      },
      urlAuth: {
        type: String
      },
      id: { // Must be a unique id. Is used by the local storage for storing the data
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
        'initFilter',
        'setID',
        'setInitFilter',
        'setIsGoogleSheet',
        'setUrlAuth',
        'setUrlData',
        'setUrlFacets'
      ])
    },
    components: {
      Header,
      Popover,
      Table
    },
    created: function () {
      const { $route, facetsURL, isGoogleSheet, id, urlData, urlAuth } = this

      // INIT FILTERS can be passed down by URL
      // First we extract the query
      const initFilter = get($route, 'query', {})
      // If elements were found, we clean the url
      if (size(initFilter)) {
        this.$router.replace({ params: {} })
      }
      // Next we save these filters for later
      this.setInitFilter(initFilter)

      // Save the url of the FACET informations
      this.setUrlFacets(facetsURL)

      // Set the ID. The id is used by the local storage. Just a unique id if multiple Finder are active
      this.setID(id)

      // Check if the DATA is stored in a Google spreadsheet
      this.setIsGoogleSheet(isGoogleSheet)

      // Set the url for the DATA
      this.setUrlData(urlData)

      // Some APIs might require an AUTHORISATION
      if (urlAuth) {
        this.setUrlAuth(urlAuth)
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
</style>
