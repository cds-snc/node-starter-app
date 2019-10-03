const {
  routeUtils,
  getClientJs,
} = require('../../utils/index')

module.exports = (app, route) => {
  const name = route.name

  // redirect from "/" → "/start"
  app.get('/', (req, res) => res.redirect(route.path[req.locale]))

  route.draw(app).get(async (req, res) => {
    // adding JS files with
    // getClientJs will look for a generated js file
    // based on the route name

    // or you can supply an array
    // ['js/file-input.js']
    const jsPath = getClientJs(req, name)
    const jsFiles = jsPath ? [jsPath] : false

    res.render(
      name,
      routeUtils.getViewData(res, { jsFiles }),
    )
  })
}
