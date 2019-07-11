<template>
  <section
    class="facet">
    <header>
      <section>
        <h3>{{ title }}</h3>
      </section>
    </header>
    <div class="add"><div>+</div></div>
  </section>
</template>

<script>
  export default {
    props: ['title', 'values', 'ki', 'options']
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

  .add {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    width: 100%;

    & > * {
      width: 80%;
      height: 80%;
      background-color: rgba(255, 255, 255, 0.6);
      border: 1px solid palette(grey, 80);
      border-radius: $radius-default;
      box-shadow: 0 1px 1px 0 rgba(0, 0, 0, 0.05);
      display: flex;
      align-items: center;
      justify-content: center;
      color: rgba(0, 0, 0, 0.2);
      font-size: 3rem;
    }
  }
</style>
