<template>
  <Wrapper
    title="Scenario Finder"
    subtitle="IAMC 1.5°C Scenario Data hosted by IIASA"
    :facetsURL="facetsURL"
    :urlData="urlData"
    :urlAuth="urlAuth"
    :id="id">
    <template v-slot:reference>
      <h1>Reference</h1><p>Daniel Huppmann, Elmar Kriegler, Volker Krey, Keywan Riahi, Joeri Rogelj, Steven K. Rose, John Weyant, et al.<br />IAMC 1.5°C Scenario Explorer and Data hosted by IIASA.<br />Integrated Assessment Modeling Consortium & International Institute for Applied Systems Analysis, 2018.<br />doi: 10.22022/SR15/08-2018.15429 | url: data.ene.iiasa.ac.at/iamc-1.5c-explorer</p>
    </template>
  </Wrapper>
</template>

<script>
  import Wrapper from '~/components/Wrapper.vue'

  export default {
    data: function () {
      return {
        id: 'scenarios',
        urlData: 'https://db1.ene.iiasa.ac.at/iamc15-api/rest/v2.1/runs?getOnlyDefaultRuns=false&includeMetadata=true',
        urlAuth: 'https://db1.ene.iiasa.ac.at/EneAuth/config/v1/anonym/IXSE_SR15',
        facetsURL: 'https://spreadsheets.google.com/feeds/list/1HHopMARCGuVQQ6sxefW08hTxTLajr4Qj2ck6a3bUvGY/od6/public/values?alt=json'
      }
    },
    components: {
      Wrapper
    }
  }
</script>
