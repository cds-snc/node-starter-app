const path = require('path')
const { routeUtils } = require('./../../utils')
const { Schema } = require('./schema.js')

module.exports = (app, route) => {
  routeUtils.addViewPath(app, path.join(__dirname, './'))

  app
    .get(route.path, (req, res) => {
      const jsFiles = ['js/file-input.js']
      res.render(route.name, routeUtils.getViewData(req, jsFiles))
    })
    .post(
      route.path,
      routeUtils.getDefaultMiddleware({ schema: Schema, name: route.name }),
    )
}
