<template>
  <Finder
    title="Methods and tools for scenario co‑production"
    :facetsURL="facetsURL"
    :urlData="urlData"
    :urlAuth="urlAuth"
    :isGoogleSheet="isGoogleSheet"
    :label="label"
    :id="id">
    <template v-slot:reference>
      <h1>Reference</h1><p>Nienke Ansems</p>
    </template>
    <template v-slot:intro>
      <p>
        In the right upper corner, you can select the facets <i class="glyph-finder-list" /> you would like to search with. You can select co-production techniques and/or methodologies based on general characteristics, your project goal and the type of scenario knowledge generation. The co-production technique and/or methodology that match your criteria will appear at the bottom of the page. Hover over the co-production name and click the <i class="glyph-finder-popup" /> icon to find a summary.<br>
        Not familiar with the terminology? Stay tuned for the launch of the scenario co-production learn module.
      </p>
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
        isGoogleSheet: true,
        label: 'technique'
      }
    },
    components: {
      Finder
    }
  }
</script>
