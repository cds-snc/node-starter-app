const { routeUtils } = require('./../../utils')
const { Schema } = require('./schema.js')

module.exports = (app, route) => {
  const name = route.name

  route.draw(app)
    .get(route.path, (req, res) => {
      res.render(name, routeUtils.getViewData(req, {}))
    })
    .post(route.path, ...route.defaultMiddleware({ schema: Schema }))
}
