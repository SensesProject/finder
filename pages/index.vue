<template>
  <Wrapper title="Co-Creation techniques" :file="file" :facets="facets" :popovers="popovers" />
</template>

<script>
  import Wrapper from '~/components/Wrapper.vue'
  import * as data from '../data/data.json'

  export default {
    data: function () {
      return {
        facets: [{
          'label': 'Name',
          'key': 'Name',
          'type': 'category',
          'title': true
        },
        {
          'label': 'Technique or Method',
          'key': 'Technique or Method',
          'type': 'category'
        },
        {
          'label': 'Type (grouping of techniques)',
          'key': 'Type (grouping of techniques)',
          'type': 'category'
        },
        {
          'label': 'Time Duration',
          'key': 'Time Duration',
          'type': 'category'
        },
        {
          'label': 'narrow/ broad participation',
          'key': 'narrow/ broad participation',
          'type': 'category'
        },
        {
          'label': 'Experts',
          'key': 'Experts',
          'type': 'category'
        },
        {
          'label': 'stakeholders',
          'key': 'stakeholders',
          'type': 'category'
        },
        {
          'label': 'group/individual',
          'key': 'group/individual',
          'type': 'category'
        },
        {
          'label': 'can be performed in a 1 day workshop',
          'key': 'can be performed in a 1 day workshop',
          'type': 'category'
        },
        {
          'label': 'in person',
          'key': 'in person',
          'type': 'category'
        },
        {
          'label': 'distance/ online',
          'key': 'distance/ online',
          'type': 'category'
        },
        {
          'label': 'Backward (normative)',
          'key': 'Backward (normative)',
          'type': 'category'
        },
        {
          'label': 'Forward (explorative)',
          'key': 'Forward (explorative)',
          'type': 'category'
        },
        {
          'label': 'Quantitative',
          'key': 'Quantitative',
          'type': 'category'
        },
        {
          'label': 'Qualitative',
          'key': 'Qualitative',
          'type': 'category'
        },
        {
          'label': 'Translation tools',
          'key': 'Translation tools',
          'type': 'category'
        },
        {
          'label': 'reduce ambiguity',
          'key': 'reduce ambiguity',
          'type': 'category'
        },
        {
          'label': 'allow ambiguity',
          'key': 'allow ambiguity',
          'type': 'category'
        },
        {
          'label': 'creative',
          'key': 'creative',
          'type': 'category'
        },
        {
          'label': 'evidence-based (systematic)',
          'key': 'evidence-based (systematic)',
          'type': 'category'
        },
        {
          'label': 'fundamental, broad exploration, probabilty, statistical',
          'key': 'fundamental, broad exploration, probabilty, statistical',
          'type': 'category'
        },
        {
          'label': 'Under-stand',
          'key': 'Under-stand',
          'type': 'category'
        },
        {
          'label': 'Generate ideas',
          'key': 'Generate ideas',
          'type': 'category'
        },
        {
          'label': 'Integrate ideas into whole',
          'key': 'Integrate ideas into whole',
          'type': 'category'
        },
        {
          'label': 'Consistency',
          'key': 'Consistency',
          'type': 'category'
        },
        {
          'label': 'Decision',
          'key': 'Decision',
          'type': 'category'
        },
        {
          'label': 'Analysis',
          'key': 'Analysis',
          'type': 'category'
        },
        {
          'label': 'Syntheis',
          'key': 'Syntheis',
          'type': 'category'
        },
        {
          'label': 'creation',
          'key': 'creation',
          'type': 'category'
        },
        {
          'label': 'Column2',
          'key': 'Column2',
          'type': 'category'
        }],
        popovers: []
      }
    },
    computed: {
      file () {
        return data
      }
    },
    components: {
      Wrapper
    }
  }
</script>
