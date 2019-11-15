const path = require('path')
const WebpackNotifierPlugin = require('webpack-notifier')
const NodemonBrowsersyncPlugin = require('nodemon-browsersync-webpack-plugin')

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
      new NodemonBrowsersyncPlugin(
        {
          script: './bin/www',
          ext: 'js,njk,json,scss',
          ignore: ['public/dist/*'],
          verbose: true,
        },
        {
          proxy: 'localhost:3000',
        },
      ),
    ],
  })

  return config
}
