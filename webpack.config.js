const path = require('path')

module.exports = (env, argv) => {
  const { getConfig } = require('@cds-snc/webpack-starter')
  const config = getConfig({
    mode: argv.mode,
    entry: {
      personal: './routes/personal/js/personal.js',
    },
    output: {
      filename: '[name].[chunkhash].js',
      path: path.resolve(__dirname, 'public/js/dist'),
    },
  })

  return config
}
