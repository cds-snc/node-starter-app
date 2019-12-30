const path = require('path')
const fs = require('fs')

module.exports = (env, argv) => {
  const { getConfig } = require('@cdssnc/webpack-starter')

  const entry = { styles: './assets/scss/app.scss' }

  require('./config/routes.config').routes.forEach(route => {
    const sourcePath = `./routes/${route.name}/client.js`
    if (fs.existsSync(sourcePath)) entry[route.name] = sourcePath
  })

  entry.global = './routes/global/client.js'

  const config = getConfig({
    mode: argv.mode,
    entry: entry,
    output: {
      filename: 'js/[name].[chunkhash].js',
      path: path.resolve(__dirname, 'public/dist'),
    },
    stats: 'errors-only',
    resolve: {
      modules: ['./assets/js'],
    }
  })

  return config
}
