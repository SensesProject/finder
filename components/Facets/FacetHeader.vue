<template>
  <header class="facet-header">
    <div class="header-title">
      <hgroup v-tooltip="{ content: tooltip }">
        <h3 :class="{ isActive: isFiltered }">{{ title }}</h3>
        <small v-if="unit">{{ unit }}</small>
      </hgroup>
      <button @click="removeFacet" class="btn btn--none btn--remove">&times;</button>
    </div>
    <aside :class="['header-aside', { list: isList }, { details: isDetails }]">
      <SensesSelect :options="years" v-if="isDetails" v-model="selectedYear" />
      <SensesSelect :options="selectableRegions" v-if="isDetails" v-model="selectedRegion" previewKey="value" />
      <button :class="['btn', 'btn--small']" :disabled="!isFiltered" @click="reset">Reset</button>
      <button v-if="isList" :class="['btn', 'btn--small', { isActive: isInverted }]" :disabled="!isFiltered" @click="toggleInvert">Invert</button>
    </aside>
    <footer class="header-footer">
      <div><span v-if="displayCount">{{ count }} option{{ count === 1 ? '' : 's' }}</span>&thinsp;</div>
      <div><button v-if="displaySorting" @click="clickName" :class="['btn', 'btn--none', 'btn--sort', { isActive: isAlphabetical }]">Name <i>{{ isReverse ? '↓' : '↑'}}</i></button></div>
      <div><button v-if="displaySorting" @click="clickCount" :class="['btn', 'btn--none', 'btn--sort', { isActive: !isAlphabetical }]">Count <i>{{ isReverse ? '↓' : '↑'}}</i></button></div>
    </footer>
  </header>
</template>

<script>
import SensesSelect from 'library/src/components/SensesSelect.vue'
import { KEY_FILTER_TYPE_DETAILS, KEY_FILTER_TYPE_LIST, SELECTION_YEARS, REGION_MAPPING } from '~/store/config'
import { isUndefined, map, get } from 'lodash'

export default {
  name: 'FacetHeader',
  components: {
    SensesSelect
  },
  props: {
    isFiltered: {
      type: Boolean
    },
    isInverted: {
      type: Boolean,
      default: undefined
    },
    isReverse: {
      type: Boolean,
      default: undefined
    },
    isAlphabetical: {
      type: Boolean,
      default: undefined
    },
    title: {
      type: String
    },
    unit: {
      type: String
    },
    year: { // Used for details
      type: Number
    },
    region: { // Used for details
      type: String
    },
    regions: {
      type: Array
    },
    tooltip: {
      type: String
    },
    count: {
      type: Number,
      default: 0
    },
    facetType: {
      type: String
    }
  },
  computed: {
    years () {
      // TODO: get from options
      return SELECTION_YEARS
    },
    selectableRegions () {
      return map(this.regions, (region) => {
        return {
          value: region,
          label: get(REGION_MAPPING, region, region)
        }
      })
    },
    selectedYear: {
      get () {
        return this.year
      },
      set (value) {
        this.$emit('changeYear', value)
      }
    },
    selectedRegion: {
      get () {
        return this.region
      },
      set (value) {
        this.$emit('changeRegion', value)
      }
    },
    displaySorting () {
      return !isUndefined(this.isReverse) && !isUndefined(this.isAlphabetical)
    },
    displayInvert () {
      return !isUndefined(this.isReverse) && !isUndefined(this.isAlphabetical)
    },
    displayCount () {
      return this.count > 0
    },
    isDetails () {
      return this.facetType === KEY_FILTER_TYPE_DETAILS
    },
    isList () {
      return this.facetType === KEY_FILTER_TYPE_LIST
    }
  },
  methods: {
    removeFacet () {
      this.$emit('removeFacet')
    },
    toggleInvert () {
      this.$emit('toggleInvert')
    },
    clickName () {
      if (!this.isAlphabetical) {
        this.$emit('toggleAlphabetical')
      } else {
        this.$emit('toggleReverse')
      }
    },
    clickCount () {
      if (this.isAlphabetical) {
        this.$emit('toggleAlphabetical')
      } else {
        this.$emit('toggleReverse')
      }
    },
    reset () {
      this.$emit('reset')
    }
  }
}
</script>

<style lang="scss" scoped>
  @import "~@/assets/style/global";

  .facet-header {
    display: grid;
    grid-template-rows: $size-small * 2 auto auto;
    align-content: space-between;
    // grid-row-gap: $spacing / 4;

    .header-title, .header-aside, .header-footer {
      display: grid;
      grid-column-gap: $spacing / 2;
    }

    .header-title {
      align-items: flex-start;
      grid-template-columns: 1fr auto;
    }

    .header-aside {
      justify-items: end;
      align-items: center;

      &.single { // If there is no invert button
        grid-template-columns: auto;
      }
      &.list {
        grid-template-columns: 1fr auto;
      }
      &.details {
        grid-template-columns: 1fr auto auto;
      }
    }

    .header-footer {
      grid-template-columns: 1fr auto auto;
      align-items: center;
    }
  }

</style>
