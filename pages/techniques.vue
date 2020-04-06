<template>
  <Finder
    title="Co-Production Techniques"
    subtitle="Overview of different methods and tools for co-production objectives"
    :facetsURL="facetsURL"
    :urlData="urlData"
    :urlAuth="urlAuth"
    :isGoogleSheet="isGoogleSheet"
    :id="id">
    <template v-slot:reference>
      <h1>Reference</h1><p>Nienke Ansems</p>
    </template>
  </Finder>
</template>

<script>
  import Finder from '~/components/Finder.vue'

  export default {
    data: function () {
      return {
        id: 'techniquesFinder',
        urlData: 'https://spreadsheets.google.com/feeds/list/172hzVn52DwRU3KCVBjkn89AeVGQlBiejq2Ip5RUy9Bk/od6/public/values?alt=json',
        urlAuth: '',
        facetsURL: 'https://spreadsheets.google.com/feeds/list/1-VC4MqVQX_kPAhJf1FC_lApyj4TX12I84rnr86IOv2g/od6/public/values?alt=json',
        isGoogleSheet: true
      }
    },
    components: {
      Finder
    }
  }
</script>
