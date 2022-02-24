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
    { src: '~/plugins/localStorage.js', ssr: false }
  ],
  router: {
    base: '/finder/'
  },
  build: {
    transpile: [
      'library'
    ]
  }
}
