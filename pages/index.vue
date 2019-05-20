<template>
  <Wrapper
    title="Scenario Finder"
    subtitle="IAMC 1.5°C Scenario Data hosted by IIASA"
    :facets="facets"
    :popovers="popovers" />
</template>

<script>
  import Wrapper from '~/components/Wrapper.vue'

  export default {
    data: function () {
      return {
        facets: [{
          'label': 'scenario',
          'key': ['scenario'],
          'type': 'Search',
          'title': true,
          'popover': {
            'url': 'https://db1.ene.iiasa.ac.at/iamc15-api/rest/v2.1/docs',
            'key': 'scenarios',
            'path': 'scen_id'
          }
        },
        {
          'label': 'model',
          'key': ['model'],
          'type': 'Facet',
          'popover': {
            'url': 'https://db1.ene.iiasa.ac.at/iamc15-api/rest/v2.1/docs',
            'key': 'models',
            'path': 'model_id'
          }
        },
        {
          'label': 'category',
          'key': ['metadata.category'],
          'type': 'Facet'
        },
        // {
        //   'label': 'subcategory',
        //   'key': ['subcategory'],
        //   'type': 'Facet'
        // },
        {
          'label': 'baseline',
          'key': ['metadata.baseline'],
          'type': 'Facet'
        },
        // {
        //   'label': 'marker',
        //   'key': ['marker'],
        //   'type': 'Facet'
        // },
        {
          'label': 'reference',
          'key': ['metadata.reference'],
          'type': 'Facet'
        },
        // {
        //   'label': 'status',
        //   'key': ['status'],
        //   'type': 'Facet'
        // },
        {
          'label': 'project',
          'key': ['metadata.project'],
          'type': 'Facet',
          'popover': {
            'url': 'https://db1.ene.iiasa.ac.at/iamc15-api/rest/v2.1/docs',
            'key': 'project',
            'path': 'project'
          }
        },
        {
          'label': 'Median Warming',
          'precision': 2,
          'key': ['metadata.median warming at peak (FAIR)'],
          'type': 'Histogram'
        },
        {
          'label': 'Year Peak Warming',
          'precision': 0,
          'key': ['metadata.year of netzero CO2 emissions', 'metadata.year of peak warming (FAIR)'],
          'type': 'Scatterplot'
        },
        {
          'label': 'Add facet',
          'key': ['scenario'],
          'type': 'Add'
        }
        // {
        //   'label': 'median warming at peak',
        //   'key': ['median warming at peak'],
        //   'type': 'number',
        //   'precision': 0
        // },
        // {
        //   'label': 'year of peak warming',
        //   'key': ['year of peak warming'],
        //   'type': 'number',
        //   'precision': -2
        // },
        // {
        //   'label': 'median warming in 2100',
        //   'key': ['median warming in 2100'],
        //   'type': 'number',
        //   'precision': 0
        // },
        // {
        //   'label': 'median warming peak-and-decline',
        //   'key': ['median warming peak-and-decline'],
        //   'type': 'number',
        //   'precision': 0
        // },
        // {
        //   'label': 'median warming at peak (FAIR)',
        //   'key': ['median warming at peak (FAIR)'],
        //   'type': 'number',
        //   'precision': 0
        // },
        // {
        //   'label': 'year of peak warming (FAIR)',
        //   'key': ['year of peak warming (FAIR)'],
        //   'type': 'number',
        //   'precision': -2
        // },
        // {
        //   'label': 'exceedance year|1.5°C',
        //   'key': ['exceedance year|1.5°C'],
        //   'type': 'number',
        //   'precision': -2
        // },
        // {
        //   'label': 'return year|1.5°C',
        //   'key': ['return year|1.5°C'],
        //   'type': 'number',
        //   'precision': -2
        // },
        // {
        //   'label': 'overshoot years|1.5°C',
        //   'key': ['overshoot years|1.5°C'],
        //   'type': 'number',
        //   'precision': -1
        // },
        // {
        //   'label': 'exceedance severity|1.5°C',
        //   'key': ['exceedance severity|1.5°C'],
        //   'type': 'number',
        //   'precision': 0
        // },
        // {
        //   'label': 'exceedance year|2.0°C',
        //   'key': ['exceedance year|2.0°C'],
        //   'type': 'number',
        //   'precision': -2
        // },
        // {
        //   'label': 'return year|2.0°C',
        //   'key': ['return year|2.0°C'],
        //   'type': 'number',
        //   'precision': 0
        // },
        // {
        //   'label': 'overshoot years|2.0°C',
        //   'key': ['overshoot years|2.0°C'],
        //   'type': 'number',
        //   'precision': 0
        // },
        // {
        //   'label': 'cumulative CO2 emissions (2016-2100)',
        //   'key': ['cumulative CO2 emissions (2016-2100)'],
        //   'type': 'number',
        //   'precision': -2
        // },
        // {
        //   'label': 'cumulative CCS (2016-2100)',
        //   'key': ['cumulative CCS (2016-2100)'],
        //   'type': 'number',
        //   'precision': -2
        // },
        // {
        //   'label': 'cumulative BECCS (2016-2100)',
        //   'key': ['cumulative BECCS (2016-2100)'],
        //   'type': 'number',
        //   'precision': -2
        // },
        // {
        //   'label': 'cumulative DAC (2016-2100)',
        //   'key': ['cumulative DAC (2016-2100)'],
        //   'type': 'number',
        //   'precision': 0
        // },
        // {
        //   'label': 'cumulative sequestration land-use (2016-2100)',
        //   'key': ['cumulative sequestration land-use (2016-2100)'],
        //   'type': 'number',
        //   'precision': -2
        // },
        // {
        //   'label': 'cumulative CO2 emissions (2016 to peak warming)',
        //   'key': ['cumulative CO2 emissions (2016 to peak warming)'],
        //   'type': 'number',
        //   'precision': -2
        // },
        // {
        //   'label': 'year of netzero CO2 emissions',
        //   'key': ['year of netzero CO2 emissions'],
        //   'type': 'number',
        //   'precision': -2
        // },
        // {
        //   'label': 'cumulative CO2 emissions (2016 to netzero)',
        //   'key': ['cumulative CO2 emissions (2016 to netzero)'],
        //   'type': 'number',
        //   'precision': -2
        // },
        // {
        //   'label': 'warming at netzero',
        //   'key': ['warming at netzero'],
        //   'type': 'number',
        //   'precision': 0
        // },
        // {
        //   'label': 'carbon price|2030',
        //   'key': ['carbon price|2030'],
        //   'type': 'number',
        //   'precision': -1
        // },
        // {
        //   'label': 'carbon price|2050',
        //   'key': ['carbon price|2050'],
        //   'type': 'number',
        //   'precision': -1
        // },
        // {
        //   'label': 'carbon price|2100',
        //   'key': ['carbon price|2100'],
        //   'type': 'number',
        //   'precision': -2
        // },
        // {
        //   'label': 'carbon price|2030 (NPV)',
        //   'key': ['carbon price|2030 (NPV)'],
        //   'type': 'number',
        //   'precision': -1
        // },
        // {
        //   'label': 'carbon price|2050 (NPV)',
        //   'key': ['carbon price|2050 (NPV)'],
        //   'type': 'number',
        //   'precision': -1
        // },
        // {
        //   'label': 'carbon price|2100 (NPV)',
        //   'key': ['carbon price|2100 (NPV)'],
        //   'type': 'number',
        //   'precision': -1
        // },
        // {
        //   'label': 'carbon price|Avg NPV (2030-2100)',
        //   'key': ['carbon price|Avg NPV (2030-2100)'],
        //   'type': 'number',
        //   'precision': -1
        // },
        // {
        //   'label': 'carbon price|AC NPV (2030-2100)',
        //   'key': ['carbon price|AC NPV (2030-2100)'],
        //   'type': 'number',
        //   'precision': -1
        // },
        // {
        //   'label': 'carbon price|CC NPV (2030-2100)',
        //   'key': ['carbon price|CC NPV (2030-2100)'],
        //   'type': 'number',
        //   'precision': -1
        // }
        ],
        popovers: ['project']
      }
    },
    components: {
      Wrapper
    }
  }
</script>
