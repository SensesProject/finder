module.exports = {
  mode: 'spa',
  head: {
    title: 'Finder',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' }
    ]
  },
  css: [
    'normalize-scss',
    '@/assets/style/base.scss'
  ],
  resolve: {
    alias: {
      style: 'assets/style'
    }
  },
  loading: { color: '#3B8070' },
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
