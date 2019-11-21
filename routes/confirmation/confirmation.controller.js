const {
  validateRouteData,
  getViewData,
  setFlashMessageContent,
} = require('../../utils/index')

module.exports = (app, route) => {
  route.draw(app)
    .get(async (req, res) => {
      res.render(route.name, getViewData(req))
    })
}
