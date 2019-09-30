const { routeUtils } = require('./../../utils')
const { Schema } = require('./schema.js')

module.exports = (app, route) => {
  app
    .get(route.path, (req, res) => {
      const jsFiles = ['js/file-input.js']
      res.render(route.name, routeUtils.getViewData(req, jsFiles))
    })
    .post(
      route.path,
      route.defaultMiddleware({ schema: Schema }),
    )
}
