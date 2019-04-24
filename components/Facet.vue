<template>
  <section
    class="facet"
    @mouseenter="setHoverKey({ key: ki })"
    @mouseleave="resetHoverKey()">
    <header>
      <section>
        <h3 :class="{ active: isActive }">{{ title }}</h3>
        <aside v-if="isActive">
          <span @click="invertFacet(ki)" :class="{ 'reset': true, 'tag': true, 'clickable': true, 'active': isInvert }">Invert</span>
          <span @click="resetFacet(ki)" class="reset tag clickable">Reset</span>
        </aside>
      </section>
      <section>
        <span v-if="number !== 0">{{ number }} options</span>
        <span v-else>&nbsp;</span>
        <aside>
          <span :class="{ active: rank, clickable: true }" @click="sort(true)">Name {{ rank && !reverse ? '↑' : '↓'}}</span><span class="spacer">/</span><span :class="{ active: !rank, clickable: true }" @click="sort(false)">Count {{ !rank && !reverse ? '↑' : '↓'}}</span>
        </aside>
      </section>
    </header>
    <ul>
      <li v-if="number === 0"><Loading /></li>
      <li
        v-for="item in list"
        v-if="!(optionsFilter && filter.length && item.current_value === 0)"
        :class="{ active: item.isActive, empty: item.current_value === 0 }">
        <svg>
          <line
            class="base"
            x1="0%"
            y1="90%"
            x2="100%"
            y2="90%" />
          <line
            x1="0%"
            y1="90%"
            :x2="item.percentage + '%'"
            y2="90%" />
          <line
            v-if="filter.length"
            class="filter"
            x1="0%"
            y1="90%"
            :x2="100 / range * (counter[ki][item.label] || 0) + '%'"
            y2="90%" />
        </svg>
        <div
          @mouseenter="setHover({ key: ki, value: item.label })"
          @mouseleave="resetHover()"
          @click="setFacet({ key: ki, value: item.label })"
          class="label">
          <span>{{ item.label }}</span>
        </div>
        <span v-if="isActive && !item.isActive" class="include" @click="addFacet({ key: ki, value: item.label })">Include</span>
        <span v-if="item.isActive" class="include" @click="removeFacet({ key: ki, value: item.label })">Exclude</span>
        <span class="counter"><span v-if="filter.length">{{ item.current_value }}/</span>{{ item.value }}</span>
      </li>
    </ul>
  </section>
</template>

<script>
  import { mapState, mapGetters, mapActions } from 'vuex'
  import { isUndefined, find, map, size, sortBy, reverse } from 'lodash'
  import Loading from '~/components/Loading.vue'

  export default {
    props: ['title', 'values', 'ki'],
    data: function () {
      return {
        rank: false,
        reverse: true
      }
    },
    computed: {
      ...mapState([
        'filter',
        'optionsFilter',
        'sortRemaining'
      ]),
      ...mapGetters([
        'counter'
      ]),
      active () {
        const keys = find(this.filter, ['key', this.ki])
        return isUndefined(keys) ? [] : keys.values
      },
      isInvert () {
        const keys = find(this.filter, ['key', this.ki])
        return isUndefined(keys) ? false : keys.invert
      },
      isActive () {
        return this.active.length > 0
      },
      number () {
        return size(this.values)
      },
      range () {
        const values = map(this.values, value => { return value })
        return Math.max(...values)
      },
      list () {
        const { ki } = this
        const list = map(this.values, (key, value) => {
          return {
            'label': value,
            'value': key,
            'current_value': this.counter[ki][value] || 0,
            'isActive': this.active.indexOf(value) > -1,
            'percentage': 100 / this.range * key
          }
        })

        const sorted = sortBy(list, this.rank ? 'label' : (this.sortRemaining ? 'current_value' : 'value'))
        return (this.reverse && !this.rank) || (!this.reverse && this.rank) ? reverse(sorted) : sorted
      }
    },
    methods: {
      ...mapActions([
        'resetFacet',
        'setFacet',
        'addFacet',
        'removeFacet',
        'setHover',
        'resetHover',
        'setHoverKey',
        'resetHoverKey',
        'invertFacet'
      ]),
      sort: function (val) {
        if (this.rank === val) {
          this.reverse = !this.reverse
        } else {
          this.rank = val
          this.reverse = true
        }
      }
    },
    components: {
      Loading
    }
  }
</script>

<style lang="scss" scoped>
  @import "~@/assets/style/variables";

  header {
    color: palette(grey, 60);
    margin-bottom: 0;

    h3 {
      text-transform: capitalize;
    }

    span {
      font-size: $size-smallest;

      &.spacer {
        display: inline-block;
        margin: 0 0.2em;
      }

      &.active {
        color: palette(grey, 10);
      }
    }

    section {
      display: flex;
      justify-content: space-between;
      align-items: center;

      &:first-child {
        min-height: 2rem;
      }
    }
  }

  ul {
    background-color: #fff;
    padding: 0.5rem;
    border: 1px solid palette(grey, 80);
    border-radius: $radius-default;
    box-shadow: inset 0 1px 1px 0 rgba(0, 0, 0, 0.05);
    overflow-y: scroll;
    height: calc(1.5rem * 10);

    .active {
      color: $color-green;
    }

    .empty .label span {
      text-decoration: line-through;
    }
  }

  svg {
    position: absolute;
    pointer-events: none;
    width: 100%;
    left: 0;
    height: 100%;

    line {
      stroke: $color-green;
      stroke-width: 1px;

      &.base {
        stroke: rgba(0, 0, 0, 0.1);
      }

      &.filter {
        stroke: $color-green;
      }
    }
  }

  li {
    font-size: $size-smallest;
    display: block;
    cursor: pointer;
    color: palette(grey, 20);
    transition-duration: 0.1s;
    display: flex;
    height: 1.3rem;
    overflow: hidden;
    position: relative;
    letter-spacing: $spacing-default;

    .label {
      white-space: nowrap;
      overflow: hidden;
      max-width: 90%;
      flex-grow: 1;
      flex: 3;
      display: block;

      span {
        z-index: 10;
        position: absolute;
        overflow: hidden;
        max-width: 90%;
        text-overflow: ellipsis;
      }
    }

    span {
      flex: 1;

      &.counter, &.include {
        text-align: right;
      }

      &.counter {
        flex: 1;
        font-size: $size-smallest;
      }

      &.include {
        font-size: $size-smallest;
        opacity: 0;
      }
    }

    &:hover {
      .include {
        opacity: 1;
        color: rgba(255, 255, 255, 0.6);

        &:hover {
          color: rgba(255, 255, 255, 1);
        }
      }
    }

    &.active .label, &.active .counter {
      font-weight: bold;
    }
  }

  ul:hover li {
    color: palette(grey, 60);

    .label span {
      text-decoration: none !important;
    }

    &:hover .label, &:hover .counter {
      color: palette(grey, 0);
    }

    &.active .label {
      color: $color-green !important;
    }
  }
</style>
