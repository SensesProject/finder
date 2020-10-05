const { getHead } = require('library/src/assets/js/head.js')

module.exports = {
  head: getHead(),
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
    },
    transpile: [
      'library'
    ]
  }
}
