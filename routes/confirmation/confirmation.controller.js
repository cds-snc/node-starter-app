const {
  validateRouteData,
  getViewData,
  setFlashMessageContent,
} = require('../../utils/index')

module.exports = (app, route) => {
  app.get(route.path, async (req, res) => {
    // ⚠️ experimental
    // validate data from previous step
    // see if we should be allowed to reach this step
    const { Schema } = require('../personal/schema.js')
    const result = await validateRouteData(req, Schema)
    if (!result.status) {
      setFlashMessageContent(req, result.errors)
      return res.redirect(route.get('personal').path)
    }

    res.render(route.name, getViewData(req))
  })
}
