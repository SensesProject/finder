<template>
  <header>
    <h3 :class="{ active: isActive }" v-tooltip="tooltip">{{ title }}</h3>
    <aside class="buttons">
      <span @click="invertFilter(id)" v-if="isActive && hasInvert" :class="['reset', 'tag', 'clickable', { active: isInvert }]">Invert</span>
      <span @click="resetFilter(id)" v-if="isActive" class="reset tag clickable">Reset</span>
    </aside>
    <span class="counter">{{ number === 0 ? '&nbsp;' : `${number} options` }}</span>
    <slot />
  </header>
</template>

<script>
  import { mapActions } from 'vuex'

  export default {
    props: {
      isActive: {
        type: [Number, Boolean]
      },
      tooltip: {
        type: String
      },
      title: {
        type: String
      },
      isInvert: {
        type: Boolean
      },
      id: {
        type: String
      },
      number: {
        type: Number
      },
      hasInvert: {
        type: Boolean,
        default: true
      }
    },
    methods: {
      ...mapActions([
        'invertFilter',
        'resetFilter'
      ])
    }
  }
</script>

<style lang="scss" scoped>
  @import "~@/assets/style/variables";

  header {
    color: palette(grey, 60);
    margin-bottom: 0;
    display: grid;
    grid-template-columns: repeat(2, auto);
    grid-template-rows: 2rem 1.5rem auto;

    h3 {
      // min-height: 2rem;
      align-items: end;
      display: inline-block;
      align-self: end;

      h3 {
        display: inline-block;
        // align-self: end;
      }
    }

    h3, .buttons {
      grid-column-end: span 2;
    }

    .buttons {
      width: 100%;
      text-align: right;
    }

    .counter {
      align-self: center;
      justify-self: start;
    }

    .sort {
      align-self: center;
      justify-self: end;
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
      &:first-child {
        min-height: 2rem;
      }

      aside {
        width: 100%;
        text-align: right;
      }
    }
  }
</style>
