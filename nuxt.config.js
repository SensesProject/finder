module.exports = {
  head: {
    title: 'Facet navigation',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
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
  plugins: [{ src: '~/plugins/localStorage.js', ssr: false }],
  build: {
    extend (config, ctx) {
      if (ctx.isDev && ctx.isClient) {
        config.module.rules.push({
          enforce: 'pre',
          test: /\.(js|vue)$/,
          loader: 'eslint-loader',
          exclude: /(node_modules)/
        })
      }
      if (ctx.isServer) {
        config.externals = [
          require('webpack-node-externals')({
            whitelist: [/^vue-slick/]
          })
        ]
      }
    }
  }
}
