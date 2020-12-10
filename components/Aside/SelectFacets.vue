<template>
  <div class="groups" :style="{ 'grid-template-columns': `repeat(${columns}, 1fr)`}">
    <div v-for="(facets, key) in defaultFacets" class="options">
      <header>
        <strong>{{ key }}</strong>
      </header>
      <ul>
        <li v-for="({ id, uniqID, label }) in facets" class="option">
          <input
            v-model="tempVisibleFacets"
            type="checkbox"
            v-bind:value="id"
            :id="uniqID" />
          <label
            :for="uniqID"
            v-html="label" />
        </li>
      </ul>
    </div>
    <div v-for="(options, key) in details" class="options">
      <header>
        <strong>{{ key }}</strong>
      </header>
      <ul>
        <li v-for="option in options" class="option">
          <SelectDetails :option="option" />
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
  import { mapState, mapActions } from 'vuex'
  import { get, uniq, map, compact, groupBy, size, keys, filter } from 'lodash'
  import { KEY_ID, KEY_TYPE, KEY_UNIQ_ID, KEY_FACETS_ALL, KEY_FACETS_VISIBLE, KEY_FILTER, KEY_FILTER_TYPE_DETAILS, SELECTION_YEARS } from '~/store/config'
  import SelectDetails from '~/components/Aside/SelectDetails.vue'

  export default {
    components: {
      SelectDetails
    },
    computed: {
      ...mapState('facets', {
        facets: KEY_FACETS_ALL
      }),
      ...mapState('filter', {
        visibleFacets: KEY_FILTER
      }),
      visibleFacetsKeys () {
        // We use the non-unique ids here. Have a look at `checkVisibleFacetList` function in `modules/filter` for more information
        return map(this.visibleFacets, KEY_ID)
      },
      tempVisibleFacets: {
        get () {
          return this.visibleFacetsKeys
        },
        set (val) {
          // This takes the list of soon to be visible facets/filter ids
          this.checkVisibleFacetList(val)
        }
      },
      toggleableFacets () {
        return filter(this.facets, facet => !get(facet, 'system', true))
      },
      defaultFacets () {
        const nonDetailsFacets = filter(this.toggleableFacets, facet => get(facet, KEY_TYPE) !== KEY_FILTER_TYPE_DETAILS)
        const options = map(nonDetailsFacets, ({ group, label, [KEY_UNIQ_ID]: uniqID, [KEY_ID]: id }) => {
          // We need both the unique id and the non unique id
          // The unique id is just used for safety as the dom id
          // Since we are using non-details facets here, we don’t use the id
          // That’s because the filters (in comparison to the facets) don’t have a unique id
          // The unique id is only created once the filter has a facet instance
          // So if we add a facet from the popover we need the id of the facet to find it in the list
          return {
            id,
            uniqID,
            label,
            group
          }
        })
        return groupBy(options, 'group')
      },
      details () {
        return groupBy(filter(this.toggleableFacets, facet => get(facet, KEY_TYPE) === KEY_FILTER_TYPE_DETAILS), 'group')
      },
      columns () {
        return size(this.defaultFacets) + size(this.details)
      }
    },
    methods: {
      ...mapActions('filter', [
        'checkVisibleFacetList'
      ])
    }
  }
</script>

<style lang="scss" scoped>
  @import "~@/assets/style/global";

  .tooltip[aria-hidden='true'] {
    display: none;
  }

  .groups {
    display: grid;
    grid-auto-flow: column;
    column-gap: $spacing;
    max-width: 1000px;

    .options {
      display: grid;
      grid-auto-flow: row;
      row-gap: 1rem;
      align-content: start;
      list-style: none;
    }

    .option {
      color: getColor(gray, 10);
      font-size: $size-smallest;
      align-self: start;
      display: grid;
      // margin: 0.4rem 0;
      padding: 0.4rem 0;
      grid-column-gap: 0.4rem;
      grid-auto-flow: column;
      grid-template-columns: auto 1fr;
      border-bottom: 1px solid #e4e4e4;
      align-items: start;

      &.option-details {
        grid-template-columns: 1fr auto;
      }

      &:last-child {
        margin-bottom: 0;
        border-bottom: 0;
        padding-bottom: 0;
      }

      input {
        margin-right: $spacing / 6;
        margin-top: 1px;
      }

      label {
        display: block;
        line-height: 1.2;
      }
    }
  }
</style>
