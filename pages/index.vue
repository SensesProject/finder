<template>
  <Wrapper
    title="Scenario Finder"
    subtitle="IAMC 1.5°C Scenario Data hosted by IIASA"
    :facets="facets"
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
        facets: [{
          'label': 'Scenario',
          'key': 'scenario',
          'tooltip': 'Scenario name',
          'visible': true,
          'type': 'Search',
          'title': true,
          'popover': {
            'url': 'https://db1.ene.iiasa.ac.at/iamc15-api/rest/v2.1/docs',
            'key': 'scenarios',
            'path': 'scen_id'
          }
        },
        {
          'label': 'Model',
          'key': 'model',
          'tooltip': 'Model name',
          'visible': true,
          'type': 'Facet',
          'popover': {
            'url': 'https://db1.ene.iiasa.ac.at/iamc15-api/rest/v2.1/docs',
            'key': 'models',
            'path': 'model_id'
          }
        },
        {
          'label': 'Category',
          'key': 'metadata.category',
          'tooltip': 'Category type',
          'visible': true,
          'type': 'Facet'
        },
        {
          'label': 'Subcategory',
          'key': 'metadata.subcategory',
          'tooltip': 'Subcategory type',
          'visible': false,
          'type': 'Facet'
        },
        {
          'label': 'Baseline',
          'key': 'metadata.baseline',
          'tooltip': 'Baseline',
          'visible': true,
          'type': 'Facet'
        },
        {
          'label': 'Reference',
          'key': 'metadata.reference',
          'tooltip': 'Reference',
          'visible': false,
          'type': 'Facet'
        },
        {
          'label': 'Project',
          'key': 'metadata.project',
          'tooltip': 'Project name',
          'visible': true,
          'type': 'Facet',
          'popover': {
            'url': 'https://db1.ene.iiasa.ac.at/iamc15-api/rest/v2.1/docs',
            'key': 'project',
            'path': 'project'
          }
        },
        {
          'label': 'Kyoto-GHG',
          'key': 'metadata.Kyoto-GHG|2010 (SAR)',
          'tooltip': '2010 (SAR)',
          'visible': false,
          'type': 'Facet'
        },
        {
          'label': 'Carbon Price Average',
          'precision': 2,
          'key': 'metadata.carbon price|Avg NPV (2030-2100)',
          'tooltip': 'Avg NPV (2030-2100)',
          'visible': false,
          'type': 'Histogram'
        },
        {
          'label': 'Year of NetZero CO2 Emissions',
          'precision': 2,
          'key': 'metadata.year of netzero CO2 emissions',
          'tooltip': 'Year of NetZero CO2 Emissions',
          'visible': false,
          'type': 'Histogram'
        },
        {
          'label': 'Carbon Price 2100 NPV',
          'precision': 2,
          'key': 'metadata.carbon price|2100 (NPV)',
          'tooltip': '2100 (NPV)',
          'visible': false,
          'type': 'Histogram'
        },
        {
          'label': 'Cumulative CO2 Emissions',
          'precision': 2,
          'key': 'metadata.cumulative CO2 emissions (2016 to peak warming, Gt CO2)',
          'tooltip': '2016 to peak warming, Gt CO2',
          'visible': false,
          'type': 'Histogram'
        },
        {
          'label': 'Median Warming at Peak',
          'precision': 2,
          'key': 'metadata.median warming at peak (MAGICC6)',
          'tooltip': 'MAGICC6',
          'visible': false,
          'type': 'Histogram'
        },
        {
          'label': 'Carbon Price CC',
          'precision': 2,
          'key': 'metadata.carbon price|CC NPV (2030-2100)',
          'tooltip': 'CC NPV (2030-2100)',
          'visible': false,
          'type': 'Histogram'
        },
        {
          'label': 'Carbon Price 2030',
          'precision': 2,
          'key': 'metadata.carbon price|2030',
          'tooltip': 'Carbon Price 2030',
          'visible': false,
          'type': 'Histogram'
        },
        {
          'label': 'Year of Return 1.5°C',
          'precision': 2,
          'key': 'metadata.return year|1.5°C',
          'tooltip': 'Year of Return 1.5°C',
          'visible': false,
          'type': 'Histogram'
        },
        {
          'label': 'Median Warming in 2100',
          'precision': 2,
          'key': 'metadata.median warming in 2100 (MAGICC6)',
          'tooltip': 'Median Warming in 2100 (MAGICC6)',
          'visible': false,
          'type': 'Histogram'
        },
        {
          'label': 'Exceedance Year',
          'precision': 2,
          'key': 'metadata.exceedance year|1.5°C',
          'tooltip': 'Exceedance Year 1.5°C',
          'visible': false,
          'type': 'Histogram'
        },
        {
          'label': 'Cumulative BECCS',
          'precision': 2,
          'key': 'metadata.cumulative BECCS (2016-2100, Gt CO2)',
          'tooltip': 'Cumulative BECCS (2016-2100, Gt CO2)',
          'visible': false,
          'type': 'Histogram'
        },
        {
          'label': 'Cumulative CO2 Emissions',
          'precision': 2,
          'key': 'metadata.cumulative CO2 emissions (2016 to netzero, Gt CO2)',
          'tooltip': 'cumulative CO2 emissions (2016 to netzero, Gt CO2)',
          'visible': false,
          'type': 'Histogram'
        },
        {
          'label': 'Year of Peak Warming (FAIR)',
          'precision': 2,
          'key': 'metadata.year of peak warming (FAIR)',
          'tooltip': 'Year of Peak Warming (FAIR)',
          'visible': false,
          'type': 'Histogram'
        },
        {
          'label': 'Year of Peak Warming (MAGICC6)',
          'precision': 2,
          'key': 'metadata.year of peak warming (MAGICC6)',
          'tooltip': 'Year of Peak Warming (MAGICC6)',
          'visible': false,
          'type': 'Histogram'
        },
        {
          'label': 'Cumulative Sequestration Land-Use',
          'precision': 2,
          'key': 'metadata.cumulative sequestration land-use (2016-2100, Gt CO2)',
          'tooltip': 'Cumulative Sequestration Land-Use (2016-2100, Gt CO2)',
          'visible': false,
          'type': 'Histogram'
        },
        {
          'label': 'Minimum Net CO2 Emissions',
          'precision': 2,
          'key': 'metadata.minimum net CO2 emissions (Gt CO2/yr)',
          'tooltip': 'Minimum Net CO2 Emissions (Gt CO2/yr)',
          'visible': false,
          'type': 'Histogram'
        },
        {
          'label': 'Cumulative CO2 Emissions',
          'precision': 2,
          'key': 'metadata.cumulative CO2 emissions (2016-2100, Gt CO2)',
          'tooltip': 'Cumulative CO2 Emissions (2016-2100, Gt CO2)',
          'visible': false,
          'type': 'Histogram'
        },
        {
          'label': 'Exceedance Severity',
          'precision': 2,
          'key': 'metadata.exceedance severity|1.5°C',
          'tooltip': 'Exceedance Severity 1.5°C',
          'visible': false,
          'type': 'Histogram'
        },
        {
          'label': 'Carbon Price AC',
          'precision': 2,
          'key': 'metadata.carbon price|AC NPV (2030-2100)',
          'tooltip': 'Carbon Price|AC NPV (2030-2100)',
          'visible': false,
          'type': 'Histogram'
        },
        {
          'label': 'Final Energy',
          'precision': 2,
          'key': 'metadata.final energy|2100',
          'tooltip': 'Final Energy in 2100',
          'visible': false,
          'type': 'Histogram'
        },
        {
          'label': 'Carbon Price 2050',
          'precision': 2,
          'key': 'metadata.carbon price|2050',
          'tooltip': 'Carbon Price in 2050',
          'visible': false,
          'type': 'Histogram'
        },
        {
          'label': 'Overshoot Years',
          'precision': 2,
          'key': 'metadata.overshoot years|1.5°C',
          'tooltip': 'Overshoot Years at 1.5°C',
          'visible': false,
          'type': 'Histogram'
        },
        {
          'label': 'Carbon Price 2100',
          'precision': 2,
          'key': 'metadata.carbon price|2100',
          'tooltip': 'Carbon Price in 2100',
          'visible': false,
          'type': 'Histogram'
        },
        {
          'label': 'Carbon Price in 2050 NPV',
          'precision': 2,
          'key': 'metadata.carbon price|2050 (NPV)',
          'tooltip': 'Carbon Price in 2050 (NPV)',
          'visible': false,
          'type': 'Histogram'
        },
        {
          'label': 'Carbon Price in 2030 NPV',
          'precision': 2,
          'key': 'metadata.carbon price|2030 (NPV)',
          'tooltip': 'Carbon Price in 2030 (NPV)',
          'visible': false,
          'type': 'Histogram'
        },
        {
          'label': 'Warming at Netzero',
          'precision': 2,
          'key': 'metadata.warming at netzero (MAGICC6)',
          'tooltip': 'Warming at Netzero (MAGICC6)',
          'visible': false,
          'type': 'Histogram'
        },
        {
          'label': 'Cumulative CCS',
          'precision': 2,
          'key': 'metadata.cumulative CCS (2016-2100, Gt CO2)',
          'tooltip': 'Cumulative CCS (2016-2100, Gt CO2)',
          'visible': false,
          'type': 'Histogram'
        },
        {
          'label': 'Median Warming Peak-and-Decline',
          'precision': 2,
          'key': 'metadata.median warming peak-and-decline (MAGICC6)',
          'tooltip': 'Median Warming Peak-and-Decline (MAGICC6)',
          'visible': false,
          'type': 'Histogram'
        },
        {
          'label': 'Median Warming at Peak',
          'precision': 2,
          'key': 'metadata.median warming at peak (FAIR)',
          'tooltip': 'Median Warming at Peak (FAIR)',
          'visible': false,
          'type': 'Histogram'
        }]
      }
    },
    components: {
      Wrapper
    }
  }
</script>
