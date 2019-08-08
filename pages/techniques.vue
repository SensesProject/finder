<template>
  <Wrapper
    title="Co-Production Techniques"
    subtitle="Lorem ipsum"
    :facets="facets"
    :urlData="urlData"
    :urlAuth="urlAuth"
    :id="id">
    <template v-slot:reference>
      <h1>Reference</h1><p>Nienke Ansems</p>
    </template>
  </Wrapper>
</template>

<script>
  import Wrapper from '~/components/Wrapper.vue'

  export default {
    data: function () {
      return {
        id: 'techniques',
        urlData: 'http://zeto.horologium.uberspace.de/co-production-techniques/techniques',
        urlAuth: '',
        facets: [{
          'label': 'Name',
          'key': ['Name'],
          'tooltip': 'Name',
          'visible': true,
          'type': 'Search',
          'title': true
        },
        {
          'label': 'Technique or Method',
          'key': ['Technique or Method'],
          'tooltip': 'Technique or Method',
          'visible': true,
          'type': 'Facet'
        },
        {
          'label': 'Type',
          'key': ['Type'],
          'tooltip': 'Type',
          'visible': true,
          'type': 'Facet'
        },
        {
          'label': 'Time Duration',
          'key': ['Time Duration'],
          'tooltip': 'Time Duration',
          'visible': true,
          'type': 'Facet'
        },
        {
          'label': 'stakeholder participation',
          'key': ['stakeholder participation'],
          'tooltip': 'stakeholder participation',
          'visible': true,
          'type': 'Facet'
        },
        {
          'label': 'Experts',
          'key': ['Experts'],
          'tooltip': 'Experts',
          'visible': false,
          'type': 'Facet'
        },
        {
          'label': 'stakeholders',
          'key': ['stakeholders'],
          'tooltip': 'stakeholders',
          'visible': false,
          'type': 'Facet'
        },
        {
          'label': 'workshop format',
          'key': ['workshop format'],
          'tooltip': 'workshop format',
          'visible': false,
          'type': 'Facet'
        },
        {
          'label': 'one day workshop',
          'key': ['one day workshop'],
          'tooltip': 'one day workshop',
          'visible': false,
          'type': 'Facet'
        },
        {
          'label': 'interaction in person',
          'key': ['interaction in person'],
          'tooltip': 'interaction in person',
          'visible': false,
          'type': 'Facet'
        },
        {
          'label': 'interaction distance',
          'key': ['interaction distance'],
          'tooltip': 'interaction distance',
          'visible': false,
          'type': 'Facet'
        },
        {
          'label': 'Scenario Perspective Backward',
          'key': ['Scenario Perspective Backward'],
          'tooltip': 'Scenario Perspective Backward',
          'visible': false,
          'type': 'Facet'
        },
        {
          'label': 'Scenario Perspective Forward',
          'key': ['Scenario Perspective Forward'],
          'tooltip': 'Scenario Perspective Forward',
          'visible': false,
          'type': 'Facet'
        },
        {
          'label': 'Information Solicited Quantitative',
          'key': ['Information Solicited Quantitative'],
          'tooltip': 'Information Solicited Quantitative',
          'visible': false,
          'type': 'Facet'
        },
        {
          'label': 'Information Solicited Qualitative',
          'key': ['Information Solicited Qualitative'],
          'tooltip': 'Information Solicited Qualitative',
          'visible': false,
          'type': 'Facet'
        },
        {
          'label': 'Information Solicited Translation tools',
          'key': ['Information Solicited Translation tools'],
          'tooltip': 'Information Solicited Translation tools',
          'visible': false,
          'type': 'Facet'
        },
        {
          'label': 'reduce ambiguity',
          'key': ['reduce ambiguity'],
          'tooltip': 'reduce ambiguity',
          'visible': false,
          'type': 'Facet'
        },
        {
          'label': 'allow ambiguity',
          'key': ['allow ambiguity'],
          'tooltip': 'allow ambiguity',
          'visible': false,
          'type': 'Facet'
        },
        {
          'label': 'knowledge generation creative',
          'key': ['knowledge generation creative'],
          'tooltip': 'knowledge generation creative',
          'visible': false,
          'type': 'Facet'
        },
        {
          'label': 'knowledge generation evidence-based',
          'key': ['knowledge generation evidence-based'],
          'tooltip': 'knowledge generation evidence-based',
          'visible': false,
          'type': 'Facet'
        },
        {
          'label': 'Uncertainty',
          'key': ['Uncertainty'],
          'tooltip': 'Uncertainty',
          'visible': false,
          'type': 'Facet'
        },
        {
          'label': 'Under-stand',
          'key': ['Under-stand'],
          'tooltip': 'Under-stand',
          'visible': false,
          'type': 'Facet'
        },
        {
          'label': 'Generate ideas',
          'key': ['Generate ideas'],
          'tooltip': 'Generate ideas',
          'visible': false,
          'type': 'Facet'
        },
        {
          'label': 'Integrate ideas into whole',
          'key': ['Integrate ideas into whole'],
          'tooltip': 'Integrate ideas into whole',
          'visible': false,
          'type': 'Facet'
        },
        {
          'label': 'Consistency',
          'key': ['Consistency'],
          'tooltip': 'Consistency',
          'visible': false,
          'type': 'Facet'
        },
        {
          'label': 'Decision',
          'key': ['Decision'],
          'tooltip': 'Decision',
          'visible': false,
          'type': 'Facet'
        },
        {
          'label': 'Knowledge construction Analysis',
          'key': ['Knowledge construction Analysis'],
          'tooltip': 'Knowledge construction Analysis',
          'visible': false,
          'type': 'Facet'
        },
        {
          'label': 'Knowledge construction Syntheis',
          'key': ['Knowledge construction Syntheis'],
          'tooltip': 'Knowledge construction Syntheis',
          'visible': false,
          'type': 'Facet'
        },
        {
          'label': 'Knowledge construction creation',
          'key': ['Knowledge construction creation'],
          'tooltip': 'Knowledge construction creation',
          'visible': false,
          'type': 'Facet'
        }]
      }
    },
    components: {
      Wrapper
    }
  }
</script>
