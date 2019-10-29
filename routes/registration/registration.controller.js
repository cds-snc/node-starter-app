const { routeUtils } = require('./../../utils')
const { Schema } = require('./schema.js')

module.exports = (app, route) => {
  const name = route.name

  route
    .draw(app)

    .get((req, res) => {
      const jsFiles = ['js/file-input.js']
      res.render(name, routeUtils.getViewData(req, jsFiles))
    })
    .post(route.applySchema(Schema), route.doRedirect())
}
