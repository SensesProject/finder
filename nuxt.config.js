const { getHead } = require('library/src/assets/js/head.js')

module.exports = {
  mode: 'spa',
  head: getHead({
    title: 'Scenario Finder',
    description: 'This explore module allows you to quickly filter all avialable scenarios from the IAMC 1.5 database.'
  }),
  css: [
    'normalize-scss',
    '@/assets/style/base.scss'
  ],
  resolve: {
    alias: {
      style: 'assets/style'
    }
  },
  plugins: [
    { src: '~/plugins/localStorage.js', ssr: false },
    { src: '~/plugins/vue-drag-resize', ssr: false }
  ],
  router: {
    base: '/finder/'
  },
  build: {
    extend (config, ctx) {
    }
  }
}
