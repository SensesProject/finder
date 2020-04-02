<template>
  <svg xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid" viewBox="0 0 100 100">
    <g transform="translate(20 50)">
      <circle r="6">
        <animateTransform attributeName="transform" begin="-0.375s" calcMode="spline" dur="1s" keySplines="0.3 0 0.7 1;0.3 0 0.7 1" keyTimes="0;0.5;1" repeatCount="indefinite" type="scale" values="0;1;0"/>
      </circle>
    </g>
    <g transform="translate(40 50)">
      <circle r="6">
        <animateTransform attributeName="transform" begin="-0.25s" calcMode="spline" dur="1s" keySplines="0.3 0 0.7 1;0.3 0 0.7 1" keyTimes="0;0.5;1" repeatCount="indefinite" type="scale" values="0;1;0"/>
      </circle>
    </g>
    <g transform="translate(60 50)">
      <circle r="6">
        <animateTransform attributeName="transform" begin="-0.125s" calcMode="spline" dur="1s" keySplines="0.3 0 0.7 1;0.3 0 0.7 1" keyTimes="0;0.5;1" repeatCount="indefinite" type="scale" values="0;1;0"/>
      </circle>
    </g>
    <g transform="translate(80 50)">
      <circle r="6">
        <animateTransform attributeName="transform" begin="0s" calcMode="spline" dur="1s" keySplines="0.3 0 0.7 1;0.3 0 0.7 1" keyTimes="0;0.5;1" repeatCount="indefinite" type="scale" values="0;1;0"/>
      </circle>
    </g>
  </svg>
</template>

<script>
  export default {}
</script>

<style lang="scss" scoped>
  @import "~@/assets/style/global";

  circle {
    fill: #222;
  }
</style>
