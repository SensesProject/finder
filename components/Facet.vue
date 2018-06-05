<template>
  <section>
    <header>
      <h2 :class="{ active: active.length }">{{ title }}</h2>
      <span v-if="active.length" @click="resetFacet(ki)" class="reset">Reset</span>
    </header>
    <ul>
      <li
        v-for="(n, value) in values"
        :class="{ active: active.indexOf(value) > -1 }">
        <span @click="setFacet({ key: ki, value: value })">{{ value }}: {{ n }}</span>
        <span v-if="active.length && active.indexOf(value) === -1" class="include" @click="addFacet({ key: ki, value: value })">Include</span>
        <span v-if="active.indexOf(value) > -1" class="include" @click="removeFacet({ key: ki, value: value })">Exclude</span>
      </li>
    </ul>
  </section>
</template>

<script>
  import { mapState, mapActions } from 'vuex'
  import _ from 'lodash'

  export default {
    props: ['title', 'values', 'ki'],
    computed: {
      ...mapState([
        'filter'
      ]),
      active () {
        const keys = _.find(this.filter, ['key', this.ki])
        return _.isUndefined(keys) ? [] : keys.values
      }
    },
    methods: {
      ...mapActions([
        'resetFacet',
        'setFacet',
        'addFacet',
        'removeFacet'
      ])
    }
  }
</script>

<style lang="scss" scoped>
  .active {
    color: #5C9E31;
  }

  h2 {
    display: inline-block;
  }

  .reset {
    color: #DC3023;
    cursor: pointer;
  }

  li {
    display: block;
    cursor: pointer;
    color: #435B77;

    span {
      display: inline-block;

      &.include {
        margin-left: 0.5em;
        font-size: 0.7em;
        opacity: 0;
      }
    }

    &:hover {
      span {
        color: #222;
      }

      .include {
        opacity: 1;
        color: #435B77;

        &:hover {
          color: #222;
        }
      }
    }

    &.active {
      font-weight: bold;
    }
  }
</style>
