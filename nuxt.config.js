module.exports = {
  /*
   ** Headers of the page
   */
  head: {
    title: '',
    meta: [{
      charset: 'utf-8'
    },
    {
      name: 'viewport',
      content: 'width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0'
    },
    {
      hid: 'description',
      name: 'description',
      content: '优秀传媒'
    },
    {
      content: 'yes',
      name: 'apple-mobile-web-app-capable'
    },
    {
      content: 'black',
      name: 'apple-mobile-web-app-status-bar-style'
    },
    {
      content: 'telephone=no',
      name: 'format-detection'
    },
    {
      content: 'email=no',
      name: 'format-detection'
    }
    ],
    link: [{
      rel: 'icon',
      type: 'image/x-icon',
      href: '/favicon.ico'
    }]
  },
  /*
   ** Customize the progress bar color
   */
  loading: {
    color: '#ff6d25'
  },
  /*
   ** Build configuration
   */
  build: {
    /*
     ** Run ESLint on save
     */
    // extend (config, { isDev, isClient }) {
    //   if (isDev && isClient) {
    //     config.module.rules.push({
    //       enforce: 'pre',
    //       test: /\.(js|vue)$/,
    //       loader: 'eslint-loader',
    //       exclude: /(node_modules)/
    //     })
    //   }
    // },
    // 在自动生成的vandor文件中添加模块(只打包一次)，可以减少应用bundle的体积
    vendor: ['axios', 'vant', 'element-ui'],
  },
  cache: true,

  plugins: [
    '~/plugins/vant.js',
    '~/plugins/element.js',
    "~/plugins/filters.js",
    // '~/plugins/bridge.js',
    {
      src: '~/plugins/flexible',
      ssr: false
    },
    {
      src: '~/plugins/extent-flexible',
      ssr: false
    }
  ],
  css: [
    '~/assets/style/globle.css',
    '~/assets/style/flexbox.scss',
    '~/assets/style/fontSize.scss',
    '~/assets/style/element.scss',
    '~/assets/iconfont/iconfont.css',
    'vant/lib/vant-css/index.css',
    'element-ui/lib/theme-chalk/index.css',
    '~/assets/style/vant.scss',
  ]
}
