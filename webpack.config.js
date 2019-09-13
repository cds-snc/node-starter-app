const path = require('path')

module.exports = (env, argv) => {
  const { getConfig } = require('node-starter-demo')

  return (config = getConfig({
    entry: {
      hello: './src/hello.js',
    },
    output: {
      filename: '[name].[chunkhash].js',
      path: path.resolve(__dirname, 'public/js/dist'),
    },
    HtmlWebpackPluginOptions: {},
  }))
}
