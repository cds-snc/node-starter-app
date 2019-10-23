const { routeUtils, getClientJs } = require('./../../utils')
const { Schema } = require('./schema.js')

module.exports = (app, route) => {
  route
    .draw(app)
    .get((req, res) => {
      const js = getClientJs(req, route.name)
      res.render(
        route.name,
        routeUtils.getViewData(req, { jsFiles: js ? [js] : false }),
      )
    })
    .post(route.applySchema(Schema), route.doRedirect())
}
