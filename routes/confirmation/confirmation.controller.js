const {
  validateRouteData,
  getViewData,
  setFlashMessageContent,
} = require('../../utils/index')

module.exports = (app, route) => {
  route.draw(app)
    .get(async (req, res) => {
      // ⚠️ experimental
      // validate data from previous step
      // see if we should be allowed to reach this step
      const { Schema } = require('../personal/schema.js')
      const result = await validateRouteData(req, Schema)
      if (!result.status) {
        setFlashMessageContent(req, result.errors)
      }

      res.render(route.name, getViewData(req))
    })
}
