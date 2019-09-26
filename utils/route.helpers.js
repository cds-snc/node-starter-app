const { checkSchema } = require('express-validator')
const { routes: defaultRoutes } = require('../config/routes.config')
const { checkErrors } = require('./validate.helpers')
const url = require('url');

const DefaultRouteObj = { name: false, path: false }

/**
 * This request middleware checks if we are visiting a public path
 */
const checkPublic = function (req, res, next) {
  const publicPaths = ['/', '/clear', '/start']
  if (publicPaths.includes(req.path)) {
    return next()
  }

  return next()
}

const routeHasIndex = route => {
  if (!route || !route.hasOwnProperty('index')) {
    return false
  }

  return true
}

/**
 * @param {String} name route name
 * @param {Array} routes array of route objects { name: "start", path: "/start" },
 * @returns { name: "", path: "" }
 */
const getPreviousRoute = (name, routes = defaultRoutes) => {
  const route = getRouteWithIndexByName(name, routes)

  if (!routeHasIndex(route) && process.env.NODE_ENV !== 'production') {
    throw new Error(`Previous route error can't find => "${name}"`)
  }

  const prevRoute = routes[Number(route.index) - 1]
    ? routes[Number(route.index) - 1]
    : false

  if (!prevRoute) {
    return DefaultRouteObj
  }

  return prevRoute
}

/**
 * @param {String} name route name
 * @param {Array} routes array of route objects { name: "start", path: "/start" }
 * @returns { name: "", path: "" }
 */
const getNextRoute = (name, routes = defaultRoutes) => {
  const route = getRouteWithIndexByName(name, routes)

  if (!routeHasIndex(route) && process.env.NODE_ENV !== 'production') {
    throw new Error(`Next route error can't find => "${name}"`)
  }

  const nextRoute = routes[Number(route.index) + 1]
    ? routes[Number(route.index) + 1]
    : false

  if (!nextRoute) {
    return DefaultRouteObj
  }

  return nextRoute
}

const getNextRouteURL = (name, req) => {

  const nextRoute = getNextRoute(name)

  /* istanbul ignore next */
  if (!nextRoute.path) {
    throw new Error(`[POST ${req.path}] 'redirect' missing`)
  }

  return url.format({
    pathname: nextRoute.path,
    query: req.query,
  })
}

/**
 * @param {String} name route name
 * @param {Array} routes array of route objects { name: "start", path: "/start" }
 * @returns { name: "", path: "" }
 */
const getRouteByName = (name, routes = defaultRoutes) => {
  return getRouteWithIndexByName(name, routes).route
}

/**
 * @param {String} name route name
 * @param {Array} routes array of route objects { name: "start", path: "/start" }
 * @returns { index: "1", route: { name: "start", path: "/start" } }
 */
const getRouteWithIndexByName = (name, routes = defaultRoutes) => {
  const index = routes.findIndex(r => r.name === name)
  if (index >= 0) return { index, route: routes[index] }
}

const configRoutes = (app, routes = []) => {
  // require the controllers defined in the routes
  // dir and file name based on the route name
  routes.forEach(routeObj => {
    const routeName = routeObj.name
    require(`../routes/${routeName}/${routeName}.controller`)(app)
  })

  require('../routes/global/global.controller')(app)
}

const getDefaultMiddleware = options => {
  return [
    checkSchema(options.schema),
    checkErrors(options.name),
    doRedirect(options.name),
  ]
}

/**
 * attempt to auto redirect based on the next route it the route config
 */
const doRedirect = routeName => {
  return (req, res, next) => {
    if (req.body.json) {
      return next()
    }

    return res.redirect(getNextRouteURL(routeName, req));
  }
}

module.exports = {
  routeHasIndex,
  configRoutes,
  checkPublic,
  doRedirect,
  getPreviousRoute,
  getNextRoute,
  getNextRouteURL,
  getRouteByName,
  getRouteWithIndexByName,
  getDefaultMiddleware,
}
