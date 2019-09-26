const path = require('path')
const {
  routeUtils,
  getNextRoute,
  getRouteByName,
  addViewPath,
  getClientJs,
} = require('../../utils/index')

module.exports = app => {
  const name = 'start'
  const route = getRouteByName(name)
  const url = require('url');

  addViewPath(app, path.join(__dirname, './'))

  // redirect from "/" → "/start"
  app.get('/', (req, res) => res.redirect(route.path))

  app.get(route.path, async (req, res) => {
    // adding JS files with
    // getClientJs will look for a generated js file
    // based on the route name

    // or you can supply an array
    // ['js/file-input.js']
    const jsPath = getClientJs(req, name)
    const jsFiles = jsPath ? [jsPath] : false

    const nextPath = url.format({
      pathname: getNextRoute(name).path,
      query: req.query,
    })

    res.render(
      name,
      routeUtils.getViewData(res, {
        nextRoute: nextPath,
        jsFiles,
      }),
    )
  })
}
