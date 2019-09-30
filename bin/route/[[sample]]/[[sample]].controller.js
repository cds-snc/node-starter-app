const { routeUtils } = require('./../../utils')
const { Schema } = require('./schema.js')

module.exports = (app, route) => {
  const name = route.name

  app
    .get(route.path, (req, res) => {
      res.render(name, { ...routeUtils.getViewData(req, {}), nextRoute: route.next })
    })
    .post(route.path, ...route.defaultMiddleware({ schema: Schema }))
}
