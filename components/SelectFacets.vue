<template>
  <ul class="options">
    <li v-for="facet in facets">
      <input
        v-model="tempVisibleFacets"
        type="checkbox"
        v-bind:value="facet.id"
        :id="facet.label" />
      <label
        :for="facet.label"
        v-html="facet.label" />
    </li>
  </ul>
</template>

<script>
  import { mapState, mapActions } from 'vuex'
  import { get } from 'lodash'

  export default {
    computed: {
      ...mapState({
        visibleFacets: state => state.facets.visibleFacets,
        facets: state => get(state, 'facets.facets', [])
      }),
      tempVisibleFacets: {
        get: function () {
          return this.visibleFacets
        },
        set: function (val) {
          this.setVisibleFacets(val)
        }
      }
    },
    methods: {
      ...mapActions([
        'setVisibleFacets'
      ])
    }
  }
</script>

<style lang="scss" scoped>
  @import "~@/assets/style/variables";

  .tooltip[aria-hidden='true'] {
    display: none;
  }

  .options {
    li {
      color: palette(grey, 10);
      font-size: $size-smallest;
      margin-bottom: $spacing / 4;

      &:last-child {
        margin-bottom: 0;
      }

      input {
        margin-right: $spacing / 6;
      }
    }
  }
</style>
