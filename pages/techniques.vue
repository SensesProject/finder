<template>
  <Finder
    :title="title"
    :facetsURL="facetsURL"
    :urlData="urlData"
    :urlAuth="urlAuth"
    :isCSV="isCSV"
    :label="label"
    :id="id"
    :description="description"
    :image="image">
    <template v-slot:reference>
      <h1>Reference</h1><p>Nienke Ansems, Sara Talebian, Henrik Carlsen, Eric Kemp-Benedict, Lotte de Jong, Simona Pedde, Kasper Kok</p>
    </template>
    <template v-slot:intro>
      <p class="page-description">
        In the right upper corner, you can select the facets <i class="glyph-finder-list" /> you would like to search with. You can select co-production techniques and/or methodologies based on general characteristics, your project goal and the type of scenario knowledge generation. The co-production technique and/or methodology that match your criteria will appear at the bottom of the page. Hover over the co-production name and click the <i class="glyph-finder-popup" /> icon to find a summary.<br>
        Not familiar with the terminology? Have a look at our <a href="https://climatescenarios.org/co-production/" target="_blank">Co-Production Learn Module</a>.
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
        urlData: './Co-Creation_Techniques.csv',
        urlAuth: '',
        facetsURL: './Co-Creation_Techniques_Facets.csv',
        isCSV: true,
        label: 'technique',
        title: 'Methods and tools for scenario co‑production',
        description: 'This explore module allows you to quickly filter all avialable co-creation techniques.',
        image: 'https://climatescenarios.org/share/og-technique-finder.jpg'
      }
    },
    components: {
      Finder
    }
  }
</script>
