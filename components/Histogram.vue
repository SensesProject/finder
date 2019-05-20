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
          <span @click="resetSearch()" class="reset tag clickable">Reset</span>
        </aside>
      </section>
      <section>
        <aside>
          <span v-if="status === 'LOADING_SUCCESS'">{{ number }} options</span>
          <span v-else>&nbsp;</span>
        </aside>
      </section>
    </header>
    <div class="vis-wrapper">
      <ul>
        <li
          v-for="tick in ticks"
          v-html="tick.label" />
      </ul>
      <svg ref="vis" v-if="number !== 0">
        <rect
          :x="brush.x"
          :y="brush.y"
          :width="brush.width"
          :height="brush.height"
          class="brush" />
        <line
          :x1="brush.x"
          :x2="brush.width"
          :y1="brush.y"
          :y2="brush.y"
          class="brush" />
        <line
          :x1="brush.x"
          :x2="brush.width"
          :y1="brush.y2"
          :y2="brush.y2"
          class="brush" />
        <line
          class="axis"
          :x1="marginLeft / 2"
          :x2="marginLeft / 2"
          :y1="scaleY.range()[0]"
          :y2="scaleY.range()[1]" />
        <rect
          v-for="bar in bars"
          class="bar"
          :x="bar.x"
          :y="bar.y"
          :width="bar.width"
          :height="bar.height"
          v-tooltip="bar.tooltip" />
      </svg>
    </div>
  </section>
</template>

<script>
  import { histogram, extent } from 'd3-array'
  import { scaleLinear, scaleBand } from 'd3-scale'
  import { mapState, mapActions } from 'vuex'
  import { isUndefined, find, get, size, map, maxBy, flatten, compact } from 'lodash'

  export default {
    props: ['title', 'values', 'ki', 'options'],
    data: function () {
      return {
        isActive: false,
        width: 220,
        height: 250,
        barsCount: 60,
        marginLeft: 10
      }
    },
    computed: {
      ...mapState({
        status: state => get(state, 'data.status', 'ERROR')
      }),
      ...mapState([
        'filter'
      ]),
      isInvert () {
        const keys = find(this.filter, ['key', this.ki])
        return isUndefined(keys) ? false : keys.invert
      },
      number () {
        return size(this.values)
      },
      items () {
        return compact(flatten(this.values))
      },
      scaleBins () {
        return scaleLinear()
          .domain(extent(this.items)).nice(this.barsCount)
      },
      list () {
        const list = histogram()
          .domain(this.scaleBins.domain())
          .thresholds(this.scaleBins.ticks(this.barsCount))
        return list(this.items)
      },
      scaleX () {
        return scaleLinear()
          .range([0, this.width - this.marginLeft])
          .domain([0, maxBy(this.list, item => { return item.length }).length])
      },
      scaleY () {
        return scaleBand()
          .paddingInner(0.5)
          .range([0, this.height])
          .domain(map(this.list, (item, n) => { return n }))
      },
      bars () {
        return map(this.list, (item, n) => {
          return {
            x: this.marginLeft,
            y: this.scaleY(n),
            width: this.scaleX(item.length),
            height: this.scaleY.bandwidth(),
            tooltip: `${item.x0}–${item.x1}`
          }
        })
      },
      brush () {
        const [, _h] = this.scaleY.range()
        const l = _h * 0.3
        const h = _h * 0.8
        return {
          x: 0,
          width: this.width - this.marginLeft,
          y: l,
          y2: h,
          height: h - l
        }
      },
      ticks () {
        return map(this.scaleBins.domain(), tick => {
          return {
            label: tick
          }
        })
      }
    },
    methods: {
      ...mapActions([
        'resetFacet',
        'setFacet',
        'setHoverKey',
        'resetHoverKey',
        'invertFacet'
      ])
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

  .facet {
    flex-direction: column;
    display: flex;
  }

  .vis-wrapper, svg {
    height: 100%;
    flex: 1;
  }

  .vis-wrapper {
    display: flex;
    width: 100%;

    ul {
      display: flex;
      justify-content: space-between;
      flex-direction: column;

      li {
        text-align: right;
        font-size: 0.7rem;
        line-height: 0.7rem;
        color: #494950;
      }
    }
  }

  svg {
    .bar {
      fill: #39C88A;
    }

    .axis {
      stroke: rgba(0, 0, 0, .1);
    }

    rect.brush {
      fill: rgba(0, 0, 0, .05);
    }

    line.brush {
      stroke: rgba(0, 0, 0, .2);
      cursor: ns-resize;
    }
  }
</style>
