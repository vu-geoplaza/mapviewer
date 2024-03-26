process.env.VUE_APP_VERSION = require('./package.json').version

module.exports = {
  publicPath: '',
  pluginOptions: {
    i18n: {
      locale: 'en',
      fallbackLocale: 'en',
      localeDir: 'locales',
      enableInSFC: true
    }
  }
}