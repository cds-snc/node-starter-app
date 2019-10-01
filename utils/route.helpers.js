const path = require('path')
const url = require('url');

const { checkSchema } = require('express-validator')
const { checkErrors } = require('./validate.helpers')
const { addViewPath } = require('./view.helpers')

class RoutingTable {
  constructor(routes, conf) {
    Object.assign(this, conf)
    this.directory = path.resolve(this.directory || './routes')
    this.routes = routes.map((r, i) => new Route(this, i, r))
  }

  get(name) { return this.routes.find(r => r.name === name) }

  config(app) {
    this.routes.forEach(r => r.config(app))
    require(`${this.directory}/global/global.controller`)(app, this)
    return this
  }
}

class Route {
  constructor(table, index, conf) {
    this.table = table
    this.index = index
    Object.assign(this, conf)
  }

  get(routeName) { return this.table.get(routeName) }

  get directory() { return `${this.table.directory}/${this.name}` }
  get controllerPath() { return `${this.directory}/${this.name}.controller` }

  get next() { return this.table.routes[this.index + 1] }
  get prev() { return this.table.routes[this.index - 1] }

  get nextPath() { return this.next && this.next.path }
  get prevPath() { return this.prev && this.prev.path }

  url(query={}) {
    return url.format({
      pathname: this.path,
      query: query
    })
  }

  config(app) {
    addViewPath(app, this.directory)
    require(this.controllerPath)(app, this)
    return this
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
 * @returns a new routing table
 */
const makeRoutingTable = (routes, opts={}) => new RoutingTable(routes, opts)

const configRoutes = (app, routes, opts={}) => {
  // require the controllers defined in the routes
  // dir and file name based on the route name
  return makeRoutingTable(routes, opts).config(app)
}

/**
 * attempt to auto redirect based on the next route it the route config
 */
const doRedirect = route => {
  return (req, res, next) => {
    if (req.body.json) return next()
    if (!route.path) throw new Error(`[POST ${req.path}] 'redirect' missing`)

    return res.redirect(route.url(req.query))
  }
}

module.exports = {
  makeRoutingTable,
  configRoutes,
  doRedirect,
}
