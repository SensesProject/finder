<template>
  <nav class="table-navigation">
    <button class="btn btn--compact btn--light" :disabled="!(currentPage > 0)" @click="setFirstPage">&LeftArrowBar;</button>
    <button class="btn btn--compact btn--light" :disabled="!(currentPage > 0)" @click="setPreviousPage">&ShortLeftArrow;</button>
    <span class="space">Page {{ currentPage + (numberOfPages ? 1 : 0) }} of {{ numberOfPages }}</span>
    <button class="btn btn--compact btn--light" :disabled="!(currentPage < numberOfPages - 1)" @click="setNextPage">&ShortRightArrow;</button>
    <button class="btn btn--compact btn--light" :disabled="!(currentPage < numberOfPages - 1)" @click="setLastPage">&RightArrowBar;</button>
  </nav>
</template>

<script>
  import { mapState, mapActions } from 'vuex'

  export default {
    data () {
      return {
        currentPage: 0
      }
    },
    computed: {
      ...mapState('datum', [
        'numberOfPages'
      ])
    },
    methods: {
      ...mapActions('datum', [
        'setOffset'
      ]),
      setNextPage () {
        if (this.currentPage + 1 < this.numberOfPages) {
          this.currentPage += 1
          this.setOffset(this.currentPage)
        }
      },
      setPreviousPage () {
        if (this.currentPage > 0) {
          this.currentPage -= 1
          this.setOffset(this.currentPage)
        }
      },
      setLastPage () {
        this.currentPage = this.numberOfPages - 1
        this.setOffset(this.currentPage)
      },
      setFirstPage () {
        this.currentPage = 0
        this.setOffset(this.currentPage)
      }
    },
    watch: {
      filter () {
        // TODO: Go back to first page on data load and filter change
        this.setFirstPage()
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import "~@/assets/style/global";

  .table-navigation {
    button, div, .space {
      display: inline-block;
      margin: 0 $spacing / 4;

      &:first-child {
        margin-left: 0;
      }
    }
  }
</style>
