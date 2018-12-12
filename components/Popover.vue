<template>
  <transition name="fade">
    <aside
      class="popover-wrapper"
      v-if="isObject(popover)"
      @click="closePopover()">
      <div class="popover">
        <h2>AMPERE WP3</h2>
        <h3>guiding questions</h3>
        <p>The AMPERE project aimed to improve our understanding of possible pathways toward medium- and long-term climate targets at the global and European levels. The project assessed key aspects of the mitigation challenge in a world of delayed and fragmented climate policy. WP3 specifically focused on fragmented policy regimes and the effects for front-runners.</p>
        <ul>
          <li>What impacts do fragmented policy regimes (with a coalition of front-runners and staged accession of others) have on achievability of long-term targets and global energy systems?</li>
          <li>What advantages and disadvantages have the frontrunners and late-comers respectively?</li>
          <li>How much carbon leakage is caused by fragmented policies?</li>
        </ul>
        <h3>results</h3>
        <p>This study explores a situation of staged accession to a global climate policy regime from the current situation of regionally fragmented and moderate climate action. The analysis is based on scenarios in which a front runner coalition – the EU or the EU and China – embarks on immediate ambitious climate action while the rest of the world makes a transition to a global climate regime between 2030 and 2050. We assume that the ensuing regime involves strong mitigation efforts but does not require late joiners to compensate for their initially higher emissions.</p>
        <ul>
          <li>Although staged accession can achieve significant reductions of global warming, the resulting climate outcome is unlikely to be consistent with the goal of limiting global warming to 2 degrees. The addition of China to the front runner coalition can reduce pre-2050 excess emissions by 20–30%, increasing the likelihood of staying below2 degrees.</li>
          <li>Not accounting for potential co-benefits, the cost of front runner action is found to be lower for the EU than for China.</li>
          <li>Regions that delay their accession to the climate regime face a trade-off between reduced short term costs and higher transitional requirements due to larger carbon lock-ins and more rapidly increasing carbon prices during the accession period.</li>
        </ul>
        <h3>scenarios</h3>
        <p>The unique feature about WP3 scenarios are those scenarios with a period of high ambition in front-runner countries (EU or EU and China) and later following of others, as well as "reconsideration" scenarios, where front-runners shift back to no climate policy.</p>
        <h3>time horizon</h3>
        <p>Time – end</p>
      </div>
    </aside>
  </transition>
</template>

<script>
  import { mapState, mapActions } from 'vuex'
  import isObject from 'lodash/isObject'

  export default {
    computed: {
      ...mapState([
        'popover'
      ])
    },
    methods: {
      ...mapActions([
        'closePopover'
      ]),
      isObject
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

  .popover-wrapper {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    width: 100vw;
    height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: rgba(0, 0, 0, 0.4);
    z-index: 100;

    .popover {
      width: 50vw;
      height: 50vh;
      background-color: rgba(255, 255, 255, 1);
      box-shadow: 0 2px 10px rgba(0, 0, 0, .2);
      padding: $spacing * 1.5;
      overflow-y: scroll;

      p, ul {
        font-size: $size-small;
      }

      h2 {
        display: block;
      }

      h3 {
        margin-top: $spacing;
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
