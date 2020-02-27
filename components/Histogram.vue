<template>
  <section
    class="facet"
    @mouseenter="setHoverKey({ id })"
    @mouseleave="resetHoverKey()">
    <header>
      <section>
        <h3 :class="{ active: isActive }" v-tooltip="tooltip">{{ title }}</h3>
        <aside v-if="hasAnyActiveFilter && isActive">
          <span @click="resetHistogram" class="reset tag clickable">Reset</span>
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
      <svg ref="vis" v-if="number !== 0">
        <line
          class="axis"
          :x1="marginLeft - 5"
          :x2="marginLeft - 5"
          :y1="scaleY.range()[0]"
          :y2="scaleY.range()[1]" />
        <rect
          v-for="(bar, i) in bars"
          :class="{ bar: true, isActive: actives[i] }"
          :x="bar.x"
          :y="bar.y"
          :width="bar.width"
          :height="bar.height"
          v-tooltip="bar.tooltip" />
        <text
          :x="marginLeft - 10"
          :y="yLow"
          class="tick"
          text-anchor="end"
          ref="labelLow">{{ ticks.low.value }}</text>
        <text
          :x="marginLeft - 10"
          :y="yHigh"
          class="tick"
          text-anchor="end">{{ ticks.high.value }}</text>
      </svg>
      <no-ssr>
        <VueDragResize
          ref="dragElement"
          v-on:resizing="resize"
          :isActive="true"
          :preventActiveBehavior="true"
          :parentLimitation="true"
          :parentH="height"
          :parentW="width"
          :w="width - marginLeft"
          :x="marginLeft"
          :h="height"
          :sticks="['tm','bm']"
          :minh="grid"
          :gridY="grid"
          :snapToGrid="true"
          :isDraggable="false" />
      </no-ssr>
    </div>
  </section>
</template>

<script>
  import { histogram, extent } from 'd3-array'
  import { scaleLinear, scaleBand } from 'd3-scale'
  import { mapState, mapActions } from 'vuex'
  import { get, size, map, maxBy, flatten, compact, inRange, throttle } from 'lodash'

  export default {
    props: ['title', 'values', 'id', 'options', 'tooltip'],
    data: function () {
      return {
        isActive: false,
        width: 220,
        height: 250,
        barsCount: 60,
        marginLeft: 50,
        yLow: 0,
        yHigh: 0,
        labelHeight: 0,
        brushing: {
          low: -Infinity,
          high: Infinity
        }
      }
    },
    computed: {
      ...mapState({
        status: state => get(state, 'data.status', 'ERROR'),
        filter: state => get(state, 'filter.filter', [])
      }),
      hasAnyActiveFilter () {
        return this.filter.length > 0
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
          .range([0, this.height])
      },
      list () {
        const list = histogram()
          .domain(this.scaleBins.domain())
          .thresholds(this.scaleBins.ticks(this.barsCount))
        return list(this.items)
      },
      step () {
        return get(this.list, ['0', 'x1']) - get(this.list, ['0', 'x0'])
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
          // TODO: Does not include end
          return {
            x: this.marginLeft,
            y: this.scaleY(n),
            width: this.scaleX(item.length),
            height: this.scaleY.bandwidth(),
            tooltip: `${item.length} element${item.length === 1 ? ' is' : 's are'} between ${item.x0} and ${item.x1}`
          }
        })
      },
      actives () {
        return map(this.list, (item) => {
          return inRange(item.x0, this.brushing.low, this.brushing.high)
        })
      },
      grid () {
        return this.height / this.list.length
      },
      labelPlacement () {
        return scaleLinear()
          .range([this.labelHeight - 5, 0])
          .domain(this.scaleBins.domain())
      },
      ticks () {
        const { brushing } = this
        return {
          low: {
            value: brushing.low.toFixed(0)
          },
          high: {
            value: brushing.high.toFixed(0)
          }
        }
      }
    },
    methods: {
      ...mapActions([
        'resetFilter',
        'setFilter',
        'setHoverKey',
        'resetHoverKey',
        'invertFilter'
      ]),
      resetHistogram () {
        this.$refs.dragElement.top = 0
        this.$refs.dragElement.bottom = 0
        this.resetFilter(this.id)
        this.resize(this.$refs.dragElement, true)
      },
      applyFilter: throttle(function (reset) {
        const [low, high] = this.scaleBins.domain()
        this.isActive = this.brushing.low !== low || this.brushing.high !== high
        if (!reset) {
          this.setFilter({
            id: this.id,
            value: {
              low: this.brushing.low,
              high: this.brushing.high
            }
          })
        }
      }, 500),
      resize: throttle(function (newRect, reset = false) {
        const { step, scaleBins } = this
        const low = newRect.top
        const high = newRect.top + newRect.height
        this.brushing.low = Math.ceil(scaleBins.invert(low) / step) * step
        this.brushing.high = Math.ceil(scaleBins.invert(high) / step) * step
        this.yLow = low + this.labelPlacement(this.brushing.low)
        this.yHigh = high + this.labelPlacement(this.brushing.high)
        this.applyFilter(reset)
      }, 100)
    },
    watch: {
      hasAnyActiveFilter (value) {
        if (!value) {
          this.resetHistogram()
        }
      }
    },
    mounted () {
      const { scaleBins } = this
      const labelLow = get(this.$refs, 'labelLow')
      const height = labelLow ? get(this.$refs.labelLow.getBBox(), 'height') : 0
      this.labelHeight = height
      const [low, high] = scaleBins.domain()
      this.brushing.low = low
      this.brushing.high = high
      this.yLow = scaleBins(low) + this.labelPlacement(low)
      this.yHigh = scaleBins(high) + this.labelPlacement(high)
    }
  }
</script>

<style lang="scss">
.vdr {
  pointer-events: none;

  & > * {
    pointer-events: all;
  }
}

.vdr-stick {
  pointer-events: all;
}
</style>

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
    position: relative;
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
      fill: rgba(0, 0, 0, .2);

      &.isActive {
        fill: #39C88A;
      }
    }

    .axis {
      stroke: rgba(0, 0, 0, .1);
    }

    .brush {
      opacity: 0;
    }

    rect.brush {
      fill: rgba(0, 0, 0, .05);
    }

    line.brush {
      stroke: rgba(0, 0, 0, .2);
      cursor: ns-resize;
    }

    .tick {
      font-size: 0.7rem;
      fill: #494950;
    }

    &:hover {
      .brush {
        opacity: 1;
      }
    }
  }
</style>
