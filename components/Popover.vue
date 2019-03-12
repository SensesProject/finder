<template>
  <transition name="fade">
    <aside
      class="popover-wrapper"
      v-if="isObject(popover)">
      <div class="backshadow" @click="closePopover()" />
      <div class="popover">
        <span @click="closePopover()" class="button-close clickable">&times;</span>
        <div v-if="kees.length">
          <h2>{{ content['title'] }}</h2>
          <section v-for="key in kees">
            <div v-if="content[key]">
              <h3>{{ key }}</h3>
              <ul v-if="isArray(content[key])">
                <li v-for="point in content[key]">{{ point }}</li>
              </ul>
              <p v-if="!isArray(content[key])">
                {{ content[key] }}
              </p>
            </div>
          </section>
        </div>
        <h2 v-else><span>{{ key }}</span> »{{ value }}« not found</h2>
      </div>
    </aside>
  </transition>
</template>

<script>
  import { mapState, mapActions } from 'vuex'
  import isObject from 'lodash/isObject'
  import get from 'lodash/get'
  import keys from 'lodash/keys'
  import isArray from 'lodash/isArray'

  export default {
    computed: {
      ...mapState({
        'popover': state => state.popover.popover
      }),
      ...mapState([
        'popoverContent'
      ]),
      key () {
        return get(this.popover, 'key', false)
      },
      value () {
        return get(this.popover, 'value', false)
      },
      content () {
        const { popoverContent, key, value } = this
        return key && value ? get(popoverContent, `${key}.${value.toLowerCase()}`, {}) : {}
      },
      kees () {
        let kees = keys(this.content)
        kees.shift()
        return kees
      }
    },
    methods: {
      ...mapActions([
        'closePopover'
      ]),
      isObject,
      isArray
    }
  }
</script>

<style lang="scss" scoped>
  @import "~@/assets/style/variables";

  .fade-enter-active, .fade-leave-active {
    transition: opacity .5s;
  }
  .fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
    opacity: 0;
  }

  .popover-wrapper, .backshadow {
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    width: 100vw;
    height: 100vh;
  }

  .popover-wrapper {
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 100;

    .backshadow {
      background-color: rgba(0, 0, 0, 0.4);
      z-index: 1;
    }

    .popover {
      width: 50vw;
      height: 50vh;
      background-color: rgba(255, 255, 255, 1);
      box-shadow: 0 2px 10px rgba(0, 0, 0, .2);
      padding: $spacing * 1.5;
      overflow-y: scroll;
      z-index: 2;
      position: relative;

      .button-close {
        position: absolute;
        right: $spacing * 1.2;
        top: $spacing;
        font-size: $size-big;
        line-height: 1;
      }

      p, ul {
        font-size: $size-small;
      }

      h2 {
        display: block;

        span {
          text-transform: capitalize;
        }
      }

      h3 {
        margin-top: $spacing;
        text-transform: capitalize;
      }

      ul {
        list-style: none;
        padding: 0;
        margin: 0;
        margin-left: $spacing / 3;
        margin: $spacing / 2 0 $spacing / 2 $spacing / 3;

        li {
          padding: 0.2em 1em 0.2em 1.6em;
          list-style-position: inside;
          text-indent: -1.6em;
          line-height: 1.5em;
          max-width: 800px;

          &:before {
            content: "— ";
            color: $color-green;
            margin-right: 0.3em;
          }
        }
      }
    }
  }
</style>
