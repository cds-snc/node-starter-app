const { routeUtils } = require('./../../utils')
const { Schema } = require('./schema.js')

module.exports = (app, route) => {
  route.draw(app)
    .get((req, res) => {
      const jsFiles = ['js/file-input.js']
      res.render(route.name, routeUtils.getViewData(req, jsFiles))
    })
    .post(
      route.applySchema(Schema),
      route.doRedirect()
    )
}
