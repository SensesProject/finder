<template>
  <div class="page">
  	<SensesMenu />
    <div class="page-content" role="main">
      <nuxt/>
    </div>
  </div>
</template>

<script>
// eslint-disable-next-line import/no-webpack-loader-syntax
import SensesMenu from 'eslint-loader!library/src/components/SensesMenu.vue'

export default {
  components: {
    SensesMenu
  }
}
</script>

<style lang="scss">

</style>
