module.exports = {
  pages: {
    index: {
      entry: 'src/main.js',
      title: 'CyPlayer',
    },
  },

  transpileDependencies: [
    'vuetify'
  ],

  pluginOptions: {
    i18n: {
      locale: 'zhHans',
      fallbackLocale: 'en',
      localeDir: 'locales',
      enableInSFC: false,
      includeLocales: false,
      enableBridge: true
    }
  },

  pwa: {
    name: 'CyPlayer',
    themeColor: '#329EF4',
    msTileColor: '#000000',
    appleMobileWebAppCapable: 'yes',
  }
}
