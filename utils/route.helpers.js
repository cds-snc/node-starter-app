const path = require('path')
const url = require('url');

const { checkSchema } = require('express-validator')
const { checkErrors } = require('./validate.helpers')
const { addViewPath } = require('./view.helpers')

class LocaleGroup {
  constructor(routes, locales, conf) {
    this.locales = locales

    // make separate tables available at group.en, group.fr, etc
    locales.forEach(locale => {
      this[locale] = new RoutingTable(this, routes, { ...conf, locale })
    })
  }

  tableFor(locale) {
    if (this.locales.indexOf(locale) < 0) throw new Error(`invalid locale ${locale}`)

    return this[locale]
  }

  config(app) {
    // NOTE: this forEach means that we will call each controller function
    // multiple times - once for every locale. This is necessary to allow
    // registering multiple routes on /en/... and /fr/... independently.
    this.locales.forEach(l => this[l].config(app))
    return this
  }

  get(locale, name) { return this.tableFor(locale).get(name) }
  at(locale, idx) { return this.tableFor(locale).at(idx) }
}

class RoutingTable {
  constructor(localeGroup, routes, conf) {
    Object.assign(this, conf)
    this.locales = localeGroup
    this.routes = routes
    this.directory = path.resolve(this.directory || './routes')

    this.routes = routes.map((r, i) => new Route(this, i, r))
  }

  get(name) { return this.routes.find(r => r.name === name) }
  at(index) { return this.routes[index] }

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

    if (typeof this.path === 'object') {
      this.path = this.path[this.locale]
    }

    // turn the path into something like '/en/route-name'
    this.path = `/${this.locale}${this.path}`
  }

  get(routeName) { return this.table.get(routeName) }
  withLocale(locale) { return this.table.locales.at(locale, this.index) }

  get locale() { return this.table.locale }
  get directory() { return `${this.table.directory}/${this.name}` }
  get controllerPath() { return `${this.directory}/${this.name}.controller` }

  get next() { return this.table.at(this.index + 1) }
  get prev() { return this.table.at(this.index - 1) }

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

const makeRoutingTable = (routes, opts={}) => {
  return new LocaleGroup(routes, opts.locales || ['en', 'fr'], opts)
}

const configRoutes = (app, routes, opts={}) => {
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
