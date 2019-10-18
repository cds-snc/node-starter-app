const { routeUtils } = require('../../utils/index')

module.exports = (app, route) => {
  const name = route.name

  // redirect from "/" → "/start"
  app.get('/', (req, res) => res.redirect(route.path[req.locale]))

  route.draw(app).get(async (req, res) => {
    res.render(name, routeUtils.getViewData(res))
  })
}
