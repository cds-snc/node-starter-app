const {
  validateRouteData,
  getViewData,
  setFlashMessageContent,
} = require('../../utils/index')

module.exports = (app, route) => {
  route.draw(app)
    .get(route.loadFullSession(), route.render())
}
