const path = require('path')

module.exports = (env, argv) => {
  const { getConfig } = require('@cdssnc/webpack-starter')
  const config = getConfig({
    mode: argv.mode,
    entry: {
      styles: './assets/scss/app.scss',
      personal: './routes/personal/js/personal.js',
      global: './assets/js/global.js',
    },
    output: {
      filename: 'js/[name].[chunkhash].js',
      path: path.resolve(__dirname, 'public/dist'),
    },
    stats: 'errors-only',
  })

  return config
}
