<template>
  <section
    class="facet"
    @mouseenter="setHoverKey({ key: ki })"
    @mouseleave="resetHoverKey()">
    <header>
      <section>
        <h2 :class="{ active: isActive }">{{ title }}</h2>
        <aside v-if="isActive">
          <span @click="resetFacet(ki)" class="reset tag clickable">Invert</span>
          <span @click="resetFacet(ki)" class="reset tag clickable">Reset</span>
        </aside>
      </section>
      <section>
        <span>{{ number }} options</span>
        <aside>
          <span :class="{ active: rank, clickable: true }" @click="sort(true)">Name {{ rank && !reverse ? '↑' : '↓'}}</span><span class="spacer">/</span><span :class="{ active: !rank, clickable: true }" @click="sort(false)">Count {{ !rank && !reverse ? '↑' : '↓'}}</span>
        </aside>
      </section>
    </header>
    <ul>
      <li
        v-for="item in list"
        :class="{ active: item.isActive }">
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
        <span class="counter"><span v-if="filter.length">{{ counter[ki][item.label] || 0 }}/</span>{{ item.value }}</span>
      </li>
    </ul>
  </section>
</template>

<script>
  import { mapState, mapGetters, mapActions } from 'vuex'
  import _ from 'lodash'

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
        'filter'
      ]),
      ...mapGetters([
        'counter'
      ]),
      active () {
        const keys = _.find(this.filter, ['key', this.ki])
        return _.isUndefined(keys) ? [] : keys.values
      },
      isActive () {
        return this.active.length > 0
      },
      number () {
        return _.size(this.values)
      },
      range () {
        const values = _.map(this.values, value => { return value })
        return Math.max(...values)
      },
      list () {
        const list = _.map(this.values, (key, value) => {
          return {
            'label': value,
            'value': key,
            'isActive': this.active.indexOf(value) > -1,
            'percentage': 100 / this.range * key
          }
        })

        const sorted = _.sortBy(list, this.rank ? 'label' : 'value')
        return (this.reverse && !this.rank) || (!this.reverse && this.rank) ? _.reverse(sorted) : sorted
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
        'resetHoverKey'
      ]),
      sort: function (val) {
        if (this.rank === val) {
          this.reverse = !this.reverse
        } else {
          this.rank = val
          this.reverse = true
        }
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import "~@/assets/style/variables";

  .facet {
    width: 220px;
  }

  header {
    color: rgba(255, 255, 255, 0.6);
    margin-bottom: 0;

    span {
      font-size: $size-smallest;

      &.spacer {
        display: inline-block;
        margin: 0 0.2em;
      }

      &.active {
        color: rgb(255, 255, 255);
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

  h2 {
    display: inline-block;
    color: rgba(255, 255, 255, 1);
    letter-spacing: $spacing-default;
    line-height: 1em;

    &.active {
      color: #94F676;
      font-weight: bold;
    }
  }

  .reset {
    color: #DC3023;
    cursor: pointer;
  }

  ul {
    background-color: #272E35;
    padding: 0.5rem;
    border: 1px solid darken(#272E35, 2%);
    border-radius: $radius-default;
    box-shadow: inset 0 1px 4px 0 rgba(0, 0, 0, 0.14);
    overflow-y: scroll;
    height: calc(1.5rem * 10);

    .active {
      color: #94F676;
    }
  }

  svg {
    position: absolute;
    pointer-events: none;
    width: 100%;
    left: 0;
    height: 100%;

    line {
      stroke: #E38A73;
      stroke-width: 1px;

      &.base {
        stroke: rgba(255, 255, 255, 0.1);
      }

      &.filter {
        stroke: #fff;
      }
    }
  }

  li {
    font-size: $size-smaller;
    display: block;
    cursor: pointer;
    color: rgba(255, 255, 255, 0.8);
    transition-duration: 0.1s;
    display: flex;
    height: 1.5rem;
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
      // span {
      //   color: #fff;
      // }

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
    color: rgba(255, 255, 255, 0.6);

    &:hover .label, &:hover .counter {
      color: rgba(255, 255, 255, 1);
    }
  }
</style>
