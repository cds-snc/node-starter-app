const { checkSchema } = require('express-validator')
const { routes: defaultRoutes } = require('../config/routes.config')
const { checkErrors } = require('./validate.helpers')
const url = require('url');

const DefaultRouteObj = { name: false, path: false }

class RoutingTable {
  constructor(routes, conf) {
    this.routes = routes.map((r, i) => new Route(this, i, r))
    Object.assign(this, conf)
    if (!this.directory) this.directory = '../routes'
  }

  get(name) { return this.routes.find(r => r.name === name) }

  config(app) {
    this.routes.forEach(r => r.config(app))
    require(`${this.directory}/global/global.controller`)(app, this)
  }
}

class Route {
  constructor(table, index, conf) {
    this.table = table
    this.index = index
    Object.assign(this, conf)
  }

  get controllerPath() {
    return `../routes/${this.name}/${this.name}.controller`
  }

  get next() { return this.table.routes[this.index + 1] }
  get prev() { return this.table.routes[this.index - 1] }

  url(query={}) {
    return url.format({
      pathname: this.path,
      query: query
    })
  }

  config(app) {
    require(this.controllerPath)(app, this)
  }

  defaultMiddleware(opts) {
    return [
      checkSchema(opts.schema),
      checkErrors(this.name),
      doRedirect(this.next)
    ]
  }
}

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

const configRoutes = (app, routes, opts={}) => {
  // require the controllers defined in the routes
  // dir and file name based on the route name
  new RoutingTable(routes, opts).config(app)
}

/**
 * attempt to auto redirect based on the next route it the route config
 */
const doRedirect = route => {
  return (req, res, next) => {
    if (req.body.json) return next()
    if (!route.next) throw new Error(`[POST ${req.path}] 'redirect' missing`)

    return res.redirect(route.next.url(req.query))
  }
}

module.exports = {
  routeHasIndex,
  configRoutes,
  checkPublic,
  getPreviousRoute,
  getNextRoute,
  getNextRouteURL,
  getRouteByName,
  getRouteWithIndexByName,
  doRedirect,
}
