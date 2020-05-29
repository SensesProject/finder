<template>
  <Finder
    title="Scenario Finder"
    :facetsURL="facetsURL"
    :urlData="urlData"
    :urlAuth="urlAuth"
    :id="id"
    :showExplorer="true">
    <template v-slot:reference>
      <h1>Reference</h1><p>Daniel Huppmann, Elmar Kriegler, Volker Krey, Keywan Riahi, Joeri Rogelj, Steven K. Rose, John Weyant, et al.<br />IAMC 1.5°C Scenario Explorer and Data hosted by IIASA.<br />Integrated Assessment Modeling Consortium & International Institute for Applied Systems Analysis, 2018.<br />doi: 10.22022/SR15/08-2018.15429 | url: data.ene.iiasa.ac.at/iamc-1.5c-explorer</p>
    </template>
    <template v-slot:intro>
      <p>
        IAMC 1.5°C Scenario Data hosted by IIASA
      </p>
    </template>
  </Finder>
</template>

<script>
  import Finder from '~/components/Finder.vue'

  export default {
    data: function () {
      return {
        id: 'scenarioFinder',
        urlData: 'https://db1.ene.iiasa.ac.at/iamc15-api/rest/v2.1/runs?getOnlyDefaultRuns=false&includeMetadata=true',
        urlAuth: 'https://db1.ene.iiasa.ac.at/EneAuth/config/v1/anonym/IXSE_SR15',
        facetsURL: 'https://spreadsheets.google.com/feeds/list/1HHopMARCGuVQQ6sxefW08hTxTLajr4Qj2ck6a3bUvGY/od6/public/values?alt=json'
      }
    },
    components: {
      Finder
    }
  }
</script>
