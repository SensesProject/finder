<template>
  <section
    class="facet">
    <FacetHeader
      :title="title"
      :isFiltered="isFiltered"
      :tooltip="tooltip"
      :unit="unit"
      @reset="reset"
      @changeYear="onChangeYear"
      @changeRegion="onChangeRegion"
      :year="year"
      :region="region"
      :regions="regions"
      :facetType="type" />
    <div class="vis-wrapper">
      <div class="message" v-if="message">
        <span>{{ message }}</span>
      </div>
      <svg ref="vis">
        <g :class="{ isVisible: !message }">
          <line
            class="axis"
            :x1="marginLeft - 5"
            :x2="marginLeft - 5"
            :y1="scaleY.range()[0]"
            :y2="scaleY.range()[1]" />
          <rect
            v-for="(bar, i) in totalBars"
            :key="`total_${bar.key}`"
            class="bar"
            :x="bar.x"
            :y="bar.y"
            :width="bar.width"
            :height="bar.height" />
          <rect
            v-for="(bar, i) in totalBars"
            :key="`remaining_${bar.key}`"
            :class="['bar', 'value', { isActive: isFiltered && (bars[bar.key] || [])[1] }]"
            :x="bar.x"
            :y="bar.y"
            :width="(bars[bar.key] || [])[0]"
            :height="bar.height" />
          <text
            :x="marginLeft - 10"
            :y="Math.max(y, 1)"
            class="tick"
            text-anchor="end"
            dominant-baseline="hanging"
            ref="labelLow">{{ (brushLow || 0).toFixed() }}</text>
          <text
            :x="marginLeft - 10"
            :y="y + h"
            class="tick"
            text-anchor="end">{{ (brushHigh || 0).toFixed() }}</text>
        </g>
      </svg>
      <vue-draggable-resizable
        :x="x"
        :y="y"
        :w="w"
        :h="h"
        :resizable="true"
        :active="true"
        :prevent-deactivation="preventDeactivation"
        @dragging="onDrag"
        @resizing="onResize"
        :parent="true"
        :min-width="width - marginLeft"
        :handles="['tm','bm']"
        axis="y"
        v-if="!message"
      />
    </div>
  </section>
</template>

<script>
  import { extent } from 'd3-array'
  import { scaleLinear, scaleBand } from 'd3-scale'
  import { mapState, mapActions } from 'vuex'
  import { get, map, inRange, values, head, last, fromPairs, throttle, isUndefined } from 'lodash'
  import FacetHeader from '~/components/Facets/FacetHeader.vue'
  import VueDraggableResizable from 'vue-draggable-resizable'
  import { RESET_CODE } from '~/store/config'
  import { STATUS_IDLE, STATUS_LOADING, STATUS_LOADING_FAILED, KEY_STATUS, STATUS_EMPTY, KEY_FILTER_TYPE_DETAILS } from '~/store/config'
  import { detailPath } from '~/assets/js/utils'

  export default {
    name: 'FacetHistogram',
    props: {
      items: {
        type: Array,
        default: () => []
      },
      init: {
        type: Object,
        default: () => {}
      },
      title: {
        type: String
      },
      unit: {
        type: String
      },
      id: {
        type: String
      },
      tooltip: {
        type: String
      },
      type: {
        type: String
      },
      year: { // Used for details
        type: Number
      },
      region: { // Used for details
        type: String
      },
      regions: { // Used for details
        type: Array
      },
      path: { // Used for details
        type: String
      },
      thresholds: {
        type: Array,
        default: () => []
      },
      forcedValue: {
        type: [String, Object]
      }
    },
    data: function () {
      const marginLeft = 50
      const width = 220
      return {
        // status: STATUS_LOADING,
        width,
        height: 250,
        marginLeft,
        labelHeight: 0,
        brushLow: 0,
        low: 0,
        brushHigh: 0,
        high: 0,
        isFiltered: false,
        // Properties of the brush
        x: marginLeft,
        y: 1, // Lower position
        w: width - marginLeft, // Width
        h: 1, // Height
        isActive: false,
        preventDeactivation: true
      }
    },
    computed: {
      ...mapState('details', {
        details: 'data'
      }),
      status () {
        if (this.type === KEY_FILTER_TYPE_DETAILS) {
          return get(this.details, [detailPath(this.path, this.year, this.region), KEY_STATUS], STATUS_LOADING_FAILED)
        } else {
          return false
        }
        // console.log(this.details)
        // console.log(get(this.details, [detailPath(this.path, this.year, this.region), KEY_STATUS]), detailPath(this.path, this.year, this.region))
      },
      message () {
        // console.log('id:', this.id, detailPath(this.id, this.year, this.region))
        if (this.status === STATUS_LOADING) {
          return 'Loading…'
        } else if (this.status === STATUS_EMPTY) {
          return 'No data available'
        } else if (this.status === STATUS_LOADING_FAILED) {
          return 'An error occurred'
        } else {
          // If no status is present. Should only be the case for regular histograms not details.
          return false
        }
      },
      domain () {
        return extent(map(this.items, 'key'))
      },
      range () {
        // console.log([head(this.thresholds), last(this.thresholds)])
        return [head(this.thresholds), last(this.thresholds)]
      },
      maxValue () {
        return Math.max(...values(this.init))
      },
      scaleX () {
        return scaleLinear()
          .range([0, this.width - this.marginLeft])
          .domain([0, this.maxValue])
      },
      scaleY () {
        return scaleBand()
          .paddingInner(0.5)
          .range([0, this.height])
          .domain(this.thresholds)
      },
      scaleBrush () {
        return scaleLinear()
          .range([0, this.height])
          .domain(this.range)
      },
      totalBars () {
        const height = this.scaleY.bandwidth()
        const x = this.marginLeft
        return map(this.init, (value, key) => {
          return {
            key,
            x,
            width: this.scaleX(value),
            y: this.scaleY(key),
            height,
            tooltip: `${value} element${value === 1 ? ' is' : 's are'} between ${key} and ${key}`
          }
        })
      },
      bars () {
        const { brushLow, brushHigh } = this
        return fromPairs(map(this.items, ({ key, value }) => {
          return [key, [this.scaleX(value), inRange(key, brushLow, brushHigh)]]
        }))
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
      ...mapActions('filter', [
        'filter',
        'removeFacet',
        'resetFilter',
        'changeFilterYear',
        'changeFilterRegion'
      ]),
      reset () {
        const { height, range } = this
        this.y = 0
        this.h = height
        const [ low, high ] = range
        this.brushLow = low
        this.brushHigh = high
        this.apply()
      },
      apply () {
        const { brushLow, brushHigh, id, range } = this
        const [ low, high ] = range
        // console.log('APPLY', brushLow, low, brushHigh, high, id)
        if (brushLow === low && brushHigh === high) {
          this.isFiltered = false
          this.resetFilter(this.id)
        } else {
          this.isFiltered = true
          this.filter({ key: id, value: [brushLow, brushHigh] })
        }
      },
      throttledApply: throttle(function () {
        this.apply()
      }, 200),
      onResize (x, y, width, height) {
        this.y = y
        this.h = height
        this.brushLow = this.scaleBrush.invert(y)
        this.brushHigh = this.scaleBrush.invert(y + height)
        this.throttledApply()
      },
      onDrag (x, y) {
        this.y = y
        this.brushLow = this.scaleBrush.invert(y)
        this.brushHigh = this.scaleBrush.invert(y + this.h)
        this.throttledApply()
      },
      forceSelected (value) {
        if (value && value.length) {
          const low = parseFloat(value[0])
          const high = parseFloat(value[1])
          // console.log(`Setting selected to ${low}/${high} in ${this.id}`)
          this.brushLow = low
          this.brushHigh = high
          this.y = this.scaleBrush(low)
          this.h = this.scaleBrush(high) - this.scaleBrush(low)
          this.apply()
        }
      },
      onChangeYear (value) {
        this.changeFilterYear({ id: this.id, year: value })
        // this.status = STATUS_LOADING
      },
      onChangeRegion (value) {
        this.changeFilterRegion({ id: this.id, region: value })
        // this.status = STATUS_LOADING
      },
      calcHeight () {
        const { vis: el } = this.$refs
        if (!isUndefined(el)) {
          this.height = el.clientHeight
        }
      },
    },
    mounted () {
      this.calcHeight()
      window.addEventListener('resize', this.calcHeight, false)
      this.reset()
      // TODO: Not working properly
      const value = get(this.forcedValue, 'value')
      this.forceSelected(value)
    },
    components: {
      FacetHeader,
      VueDraggableResizable
    },
    watch: {
      forcedValue (newValue) {
        if (newValue === RESET_CODE) {
          // console.log(`Resetting ${this.id}`)
          this.reset()
        } else {
          // console.log(`Got a forced input at ${this.id}`)
          const value = get(newValue, 'value')
          this.forceSelected(value)
        }
      },
      year () {
        this.reset()
      }
      // items (values) {
      //   console.log(values)
      //   if (values.length) {
      //     this.status = STATUS_IDLE
      //     console.log('alles gut')
      //   } else {
      //     this.status = STATUS_LOADING_FAILED
      //     console.log('Empty')
      //   }
      // }
    }
  }
</script>

<style lang="scss">
@import "~@/assets/style/global";
.vdr {
  touch-action: none;
  position: absolute;
  box-sizing: border-box;
  border-radius: 2px;
  border: 0;
  cursor: ns-resize;
}

$handle-height: 3px;

.handle {
  box-sizing: border-box;
  position: absolute;
  width: 100%;
  height: $handle-height;
  background: $color-interactive;
  border: 0;
}
.handle-tm {
  top: -$handle-height;
  left: 0;
  margin-left: 0;
  border-radius: 1px 1px 0 0;
}
.handle-bm {
  bottom: -$handle-height;
  left: 0;
  margin-left: 0;
}
@media only screen and (max-width: 768px) {
  [class*="handle-"]:before {
    content: '';
    left: -10px;
    right: -10px;
    bottom: -10px;
    top: -10px;
    position: absolute;
  }
}
</style>

<style lang="scss" scoped>
  @import "~@/assets/style/global";

  header {
    color: $color-light-gray;
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
        color: getColor(gray, 10);
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
    height: 250px;
    // max-height: 250px;
    flex: 1;
    position: relative;
  }

  .vis-wrapper {
    display: flex;
    width: 100%;

    .message {
      position: absolute;
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      color: $color-light-gray;
      font-size: $size-small;
    }
  }

  svg {
    & > g {
      opacity: 0;
      transition: opacity 0.3s;

      &.isVisible {
        opacity: 1;
      }
    }

    .bar {
      transition: width 0.1s, fill 0.2s;
      fill: rgba(0, 0, 0, .2);

      &.value {
        fill: rgb(100, 100, 100);
      }

      &.isActive {
        fill: $color-interactive;
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
