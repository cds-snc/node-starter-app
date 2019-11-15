const path = require('path')
const WebpackNotifierPlugin = require('webpack-notifier')

module.exports = (env, argv) => {
  const { getConfig } = require('@cdssnc/webpack-starter')
  const config = getConfig({
    mode: argv.mode,
    entry: {
      styles: './assets/scss/app.scss',
      personal: './routes/personal/js/personal.js',
    },
    output: {
      filename: 'js/[name].[chunkhash].js',
      path: path.resolve(__dirname, 'public/dist'),
    },
    stats: 'errors-only',
    plugins: [
      new WebpackNotifierPlugin({
        title: 'CDS Starter App',
        contentImage:
          'https://github.com/cds-snc/common-assets/raw/master/EN/cds-snc.png',
      }),
    ],
  })

  return config
}
