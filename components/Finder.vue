<template>
  <div class="wrapper">
    <SensesMenu :id="id" :min-width="768"/>
    <Header
      :title="title"
      :subtitle="subtitle"
      :showExplorer="showExplorer">
      <slot name="intro" />
    </Header>
    <Table :label="label" />
    <Popover><slot name="reference" /></Popover>
  </div>
</template>

<script>
  const { getHead } = require('library/src/assets/js/head.js')
  import { mapActions } from 'vuex'
  import { get, size } from 'lodash'
  // eslint-disable-next-line import/no-webpack-loader-syntax
  import SensesMenu from 'library/src/components/SensesMenu.vue'
  import Header from '~/components/Header.vue'
  import Popover from '~/components/Popover.vue'
  import Table from '~/components/Table/Table.vue'

  export default {
    head () {
      return getHead({
        title: this.title,
        description: this.description,
        image: this.image
      })
    },
    props: {
      title: { // Title that is displayed in the header and in the title
        type: String,
        default: 'Finder'
      },
      description: { // Title that is displayed in the header and in the title
        type: String
      },
      image: { // Title that is displayed in the header and in the title
        type: String
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
      urlDetails: {
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
      },
      label: {
        type: String,
        default: 'item'
      },
    },
    methods: {
      ...mapActions([
        'setID',
        'initFinder'
      ]),
      ...mapActions('facets', [
        'setUrlFacets'
      ]),
      ...mapActions('filter', [
        'setInitFilter'
      ]),
      ...mapActions('load', [
        'setIsGoogleSheet',
        'setUrlData'
      ]),
      ...mapActions('auth', [
        'setUrlAuth'
      ]),
      ...mapActions('details', [
        'setUrlDetails'
      ])
    },
    components: {
      Header,
      Popover,
      Table,
      SensesMenu
    },
    created: function () {
      const { $route, facetsURL, isGoogleSheet, id, urlData, urlAuth, urlDetails } = this
      this.initFinder()

      // INIT FILTERS can be passed down by URL
      // First we extract the query
      const initFilter = get($route, 'query', {})

      // If elements were found, we clean the url
      if (size(initFilter)) {
        this.$router.replace({ params: {} })

        // Next we save these filters for later
        this.setInitFilter(initFilter)
      }

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

      if (urlDetails) {
        this.setUrlDetails(urlDetails)
      }

      // The loading of the data is triggered by the local storage -> plugins/localStorage.js
    }
  }
</script>

<style lang="scss" scoped>
  @import "~@/assets/style/global";

  .senses-menu {
    max-width: 100vw;
    left: 0;
  }

  .wrapper {
    max-height: 100vh;
    display: grid;
    min-width: calc(100vw - #{$spacing});
  }
</style>
