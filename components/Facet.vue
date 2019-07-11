<template>
  <section
    class="facet"
    @mouseenter="setHoverKey({ key: ki })"
    @mouseleave="resetHoverKey()">
    <header>
      <section>
        <h3 :class="{ active: isActive }">{{ title }}</h3>
        <aside v-if="isActive">
          <span @click="invertFilter(ki)" :class="{ 'reset': true, 'tag': true, 'clickable': true, 'active': isInvert }">Invert</span>
          <span @click="resetFilter(ki)" class="reset tag clickable">Reset</span>
        </aside>
      </section>
      <section>
        <span v-if="number !== 0">{{ number }} options</span>
        <span v-else>&nbsp;</span>
        <aside>
          <span v-tooltip="`Sort by option name ${rank && !reverse ? 'descending' : 'ascending'}`" :class="{ active: rank, clickable: true }" @click="setSortOption(true)">Name {{ rank && !reverse ? '↑' : '↓'}}</span>
          <span class="spacer">/</span>
          <span v-tooltip="`Sort by option count ${rank && !reverse ? 'descending' : 'ascending'}`" :class="{ active: !rank, clickable: true }" @click="setSortOption(false)">Count {{ !rank && !reverse ? '↑' : '↓'}}</span>
        </aside>
      </section>
    </header>
    <ul>
      <li v-if="number === 0"><Loading /></li>
      <li
        v-for="item in list"
        v-if="item.isVisible"
        :class="{ active: item.isActive, empty: item.isEmpty }"
        v-tooltip="item.isActive || isActive ? false : `Set »${item.label}« as filter option`">
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
            :x2="item.filter"
            y2="90%" />
        </svg>
        <div
          @mouseenter="setHoverValue({ key: ki, value: item.label })"
          @mouseleave="resetHoverValue()"
          @click="setFilter({ key: ki, value: item.label, type: 'key-value' })"
          class="label">
          <span>{{ item.label }}</span>
        </div>
        <span v-tooltip="`Add »${item.label}« to filter options`" v-if="isActive && !item.isActive" class="include" @click="addFilter({ key: ki, value: item.label })">Include</span>
        <span v-tooltip="`Remove »${item.label}« from filter options`" v-if="item.isActive" class="include" @click="removeFilter({ key: ki, value: item.label })">Exclude</span>
        <span :class="{ counter: true, hide: isActive }"><span v-if="filter.length">{{ item.currentValue }}/</span>{{ item.value }}</span>
      </li>
    </ul>
  </section>
</template>

<script>
  import { mapState, mapGetters, mapActions } from 'vuex'
  import { isUndefined, map, size, sortBy, reverse, get } from 'lodash'
  import Loading from '~/components/Loading.vue'

  export default {
    props: ['title', 'values', 'ki', 'options'],
    data: function () {
      return {
        rank: false,
        reverse: true
      }
    },
    computed: {
      ...mapState({
        filter: state => get(state, 'filter.filter', []),
        filterEmpty: state => get(state, 'options.filterEmpty', false),
        sortRemaining: state => get(state, 'options.sortRemaining', false)
      }),
      ...mapState({
        filterEmpty: state => get(state, 'options.filterEmpty', false),
        sortRemaining: state => get(state, 'options.sortRemaining', false)
      }),
      ...mapGetters([
        'counter'
      ]),
      active () {
        const keys = this.filter.find(({ key }) => key === this.ki)
        return isUndefined(keys) ? [] : keys.values
      },
      isInvert () {
        const keys = this.filter.find(({ key }) => key === this.ki)
        return isUndefined(keys) ? false : keys.invert
      },
      isActive () {
        return this.active.length > 0
      },
      number () {
        return size(this.options)
      },
      range () {
        const values = map(this.options, value => { return value })
        return Math.max(...values)
      },
      list () {
        const { ki, rank } = this
        const counts = get(this.counter, [ki], {})
        const list = map(this.options, (value, label) => {
          const currentValue = get(counts, [label], 0)
          const percentage = 100 / this.range
          const isEmpty = currentValue === 0
          return {
            filter: percentage * currentValue + '%',
            label,
            percentage: percentage * value,
            value,
            currentValue,
            isActive: this.active.indexOf(label) > -1,
            isEmpty,
            isVisible: !(this.filterEmpty && isEmpty)
          }
        })

        const sorted = sortBy(list, rank ? 'label' : (this.sortRemaining ? ['currentValue', 'value', 'label'] : ['value', 'label']))
        return (this.reverse && !rank) || (!this.reverse && rank) ? reverse(sorted) : sorted
      }
    },
    methods: {
      ...mapActions([
        'addFilter',
        'invertFilter',
        'removeFilter',
        'resetFilter',
        'resetHoverKey',
        'resetHoverValue',
        'setFilter',
        'setHoverKey',
        'setHoverValue'
      ]),
      setSortOption: function (val) {
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

    .empty {
      .label, .counter {
        opacity: 0.5;
      }

      .label span {
        text-decoration: line-through;
      }
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
        max-width: 70%;
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
        position: absolute;
        z-index: 10;
        right: 0;
        font-size: $size-smallest;
        opacity: 0;
      }
    }

    &:hover {
      .counter.hide {
        opacity: 0;
      }

      .include {
        opacity: 1;
        color: rgba(0, 0, 0, 0.6);

        &:hover {
          color: rgba(0, 0, 0, 1);
        }
      }
    }

    &.active .label, &.active .counter {
      font-weight: bold;
    }
  }

  ul:hover li {
    color: palette(grey, 60);

    .label {
      opacity: 1 !important;

      span {
        text-decoration: none !important;
      }
    }

    &:hover .label, &:hover .counter {
      color: palette(grey, 0);
    }

    &.active .label {
      color: $color-green !important;
    }
  }
</style>
