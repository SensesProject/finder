<template>
  <section
    class="facet"
    @mouseenter="setHoverKey({ id })"
    @mouseleave="resetHoverKey()">
    <header>
      <section>
        <h3 :class="{ active: isActive }">{{ title }}</h3>
        <aside v-if="isActive">
          <span @click="invertFacet(id)" :class="{ 'reset': true, 'tag': true, 'clickable': true, 'active': isInvert }">Invert</span>
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
      <svg ref="vis" v-if="number !== 0">
        <rect
          :x="brush.x"
          :y="brush.y"
          :width="brush.width"
          :height="brush.height"
          class="brush" />
        <line
          :x1="brush.x"
          :x2="brush.x1"
          :y1="brush.y"
          :y2="brush.y"
          class="brush brush--vertical" />
        <line
          :x1="brush.x1"
          :x2="brush.x1"
          :y1="brush.y"
          :y2="brush.y2"
          class="brush brush--horizontal" />
        <line
          :x1="brush.x"
          :x2="brush.x1"
          :y1="brush.y2"
          :y2="brush.y2"
          class="brush brush--vertical" />
        <line
          :x1="brush.x"
          :x2="brush.x"
          :y1="brush.y"
          :y2="brush.y2"
          class="brush brush--horizontal" />
        <line
          class="axis"
          :x1="center.x"
          :x2="center.x"
          :y1="center.y0"
          :y2="center.y1" />
        <g>
          <text
            v-for="tick in ticks"
            :x="tick.x"
            :y="tick.y"
            class="axis"
            v-html="tick.label" />
        </g>
        <circle
          v-for="dot in dots"
          class="dot"
          :cx="dot.x"
          :cy="dot.y"
          :r="r"
          v-tooltip="dot.tooltip" />
      </svg>
    </div>
  </section>
</template>

<script>
  import { extent } from 'd3-array'
  import { scaleLinear } from 'd3-scale'
  import { mapState, mapActions } from 'vuex'
  import { isUndefined, find, get, size, compact, map } from 'lodash'
  import { format } from 'd3-format'

  const f = format('.0%')

  export default {
    props: ['title', 'values', 'id', 'options'],
    data: function () {
      const r = 1.7
      return {
        r,
        isActive: false,
        width: 220,
        height: 250,
        margin: {
          left: r,
          top: r,
          right: r,
          bottom: 15 + r
        }
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
        const keys = find(this.filter, ['id', this.id])
        return isUndefined(keys) ? false : keys.invert
      },
      number () {
        return size(this.values)
      },
      items () {
        return this.values
      },
      extentX () {
        return extent(compact(map(this.values, value => {
          return 1 / value[0] * value[1]
        })))
      },
      extentY () {
        return extent(compact(map(this.values, '0')))
      },
      scaleX () {
        return scaleLinear()
          .range([this.margin.left, this.width - this.margin.right])
          .domain(this.extentX)
      },
      scaleY () {
        return scaleLinear()
          .range([this.margin.top, this.height - this.margin.bottom])
          .domain(this.extentY)
      },
      dots () {
        return compact(map(this.items, (item, n) => {
          if (item[0] && item[1] && (1 / item[0] * item[1])) {
            return {
              x: this.scaleX(1 / item[0] * item[1]),
              y: this.scaleY(item[0])
            }
          } else {
            return false
          }
        }))
      },
      center () {
        return {
          x: this.scaleX(1),
          y0: this.scaleY.range()[0],
          y1: this.scaleY.range()[1]
        }
      },
      ticks () {
        return map([this.scaleX.domain()[0], 1, this.scaleX.domain()[1]], tick => {
          return {
            x: this.scaleX(tick),
            label: f(tick),
            y: this.height
          }
        })
      },
      brush () {
        const [, _x2] = this.scaleX.range()
        const [, _h] = this.scaleY.range()
        const l = _h * 0.2
        const h = _h * 0.7
        const x = _x2 * 0.4
        const x1 = _x2 * 0.8
        return {
          x: x,
          x1: x1,
          x2: _x2,
          width: x1 - x,
          y: l,
          y2: h,
          height: h - l
        }
      }
    },
    methods: {
      ...mapActions([
        'resetFacet',
        'setFacet',
        'setHoverKey',
        'resetHoverKey',
        'invertFacet'
      ]),
      resetSearch: function () {
        this.term = ''
        this.resetFacet(this.id)
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import "~@/assets/style/global";

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
      }
    }
  }

  svg {
    .dot {
      fill: #39C88A;
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

      &.brush--vertical {
        cursor: ns-resize;
      }

      &.brush--horizontal {
        cursor: ew-resize;
      }
    }

    &:hover {
      .brush {
        opacity: 1;
      }
    }

    text {
      font-size: 0.7rem;
      text-anchor: middle;
      fill: #494950;

      &:first-child {
        text-anchor: start;
      }

      &:last-child {
        text-anchor: end;
      }
    }
  }
</style>
