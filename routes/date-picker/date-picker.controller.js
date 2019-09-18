const path = require('path')
const { routeUtils } = require('./../../utils')

module.exports = app => {
  const name = 'date-picker'
  const route = routeUtils.getRouteByName(name)

  routeUtils.addViewPath(app, path.join(__dirname, './'))

  const jsFiles = ['js/cal.js']

  app.get(route.path, (req, res) => {
    res.render(name, {
      jsFiles,
    })
  })
}
