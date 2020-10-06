<template>
  <header class="facet-header">
    <div class="header-title">
      <hgroup v-tooltip="{ content: tooltip }">
        <h3 :class="{ isActive: isFiltered }">{{ title }}<span v-if="region"> ({{ region }})</span></h3>
        <small v-if="unit">{{ unit }}</small>
      </hgroup>
      <button @click="removeFacet" class="btn btn--none btn--remove">&times;</button>
    </div>
    <aside :class="['header-aside', displayInvert || year ? 'double' : 'single']">
      <button v-if="year" :class="['btn', 'btn--small', { isActive: year === 2030 }]" @click="() => changeYear(2030)">2030</button>
      <button v-if="year" :class="['btn', 'btn--small', { isActive: year === 2050 }]" @click="() => changeYear(2050)">2050</button>
      <button v-if="year" :class="['btn', 'btn--small', { isActive: year === 2100 }]" @click="() => changeYear(2100)">2100</button>
      <button :class="['btn', 'btn--small']" :disabled="!isFiltered" @click="reset">Reset</button>
      <button v-if="displayInvert" :class="['btn', 'btn--small', { isActive: isInverted }]" :disabled="!isFiltered" @click="toggleInvert">Invert</button>
    </aside>
    <footer class="header-footer">
      <div><span v-if="displayCount">{{ count }} option{{ count === 1 ? '' : 's' }}</span>&thinsp;</div>
      <div><button v-if="displaySorting" @click="clickName" :class="['btn', 'btn--none', 'btn--sort', { isActive: isAlphabetical }]">Name <i>{{ isReverse ? '↓' : '↑'}}</i></button></div>
      <div><button v-if="displaySorting" @click="clickCount" :class="['btn', 'btn--none', 'btn--sort', { isActive: !isAlphabetical }]">Count <i>{{ isReverse ? '↓' : '↑'}}</i></button></div>
    </footer>
  </header>
</template>

<script>
import { isUndefined } from 'lodash'

export default {
  name: 'FacetHeader',
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
    tooltip: {
      type: String
    },
    count: {
      type: Number,
      default: 0
    }
  },
  computed: {
    displaySorting () {
      return !isUndefined(this.isReverse) && !isUndefined(this.isAlphabetical)
    },
    displayInvert () {
      return !isUndefined(this.isReverse) && !isUndefined(this.isAlphabetical)
    },
    displayCount () {
      return this.count > 0
    }
  },
  methods: {
    changeYear (value) { // For details facets
      this.$emit('changeYear', value)
    },
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
    grid-row-gap: $spacing / 4;

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
      &.double {
        grid-template-columns: 1fr auto;
      }
    }

    .header-footer {
      grid-template-columns: 1fr auto auto;
      align-items: center;
    }
  }

</style>
