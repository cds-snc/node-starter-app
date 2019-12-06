const path = require('path')
const url = require('url');

const { checkSchema } = require('express-validator')
const { checkErrors } = require('./validate.helpers')
const { addViewPath } = require('./view.helpers')
const { saveToSession } = require('./session.helpers')
const { getClientJs } = require('./load.helpers')

const wrapArray = (val) => {
  if (!val) return []
  return Array.isArray(val) ? val : [val]
}

class RoutingTable {
  /**
   * A routing table, based on the user's configured routes from
   * routes.config.js. Can have arbitrary keys set via the `conf`
   * parameter. In particular, this parameter allows setting the
   * directory for the route files, by default `./routes` from the
   * project root.
   */
  constructor(routes, locales, conf) {
    Object.assign(this, conf)
    this.locales = locales
    this.directory = path.resolve(this.directory || './routes')
    this.routes = routes.map((r, i) => new Route(this, i, r))
  }

  /**
   * Returns a route given a route name
   */
  get(name) {
    const out = this.routes.find(r => r.name === name)
    if (!out) console.warn(`missing route ${name}`)
    return out
  }

  /**
   * Attach the route controllers to an app.
   */
  config(app) {
    app.use(this.globalHelpers())
    this.routes.forEach(r => r.config(app))
    require(`${this.directory}/global/global.controller`)(app, this)
    return this
  }

  globalHelpers() { return (req, res, next) => {
    // overridden inside any route - this is so that jsPaths() still works
    // in global routes like 404.
    res.locals.jsPaths = () => []
    res.locals.globalJsPaths = () => wrapArray(getClientJs(req, 'global'))
    return next()
  } }
}

class Route {
  /**
   * A route is a single element of a routing table. It contains
   * a back-reference to the table, as well as an index in that
   * table, for use with `.prev` and `.next`, to find adjacent
   * routes in the same table. `conf` is the user's configuration
   * object, which we will expect to contain `.name` and `.path`
   * at minimum, but can also contain other configuration keys.
   */
  constructor(table, index, conf) {
    this.table = table
    this.index = index
    Object.assign(this, conf)

    // if path is specified as a string, turn it into { en: ..., fr: ... }
    // so the api is consistent
    if (typeof this.path === 'string') {
      const globalPath = this.path
      this.path = {}
      this.table.locales.forEach(l => { this.path[l] = globalPath })
    }

    // prepend the locale (/en, /fr) to each path
    this.table.locales.forEach(l => { this.path[l] = `/${l}${this.path[l]}` })
  }

  // an alias for RoutingTable::get
  get(routeName) { return this.table.get(routeName) }

  draw(app) {
    return new DrawRoutes(this, app)
  }

  // paths to load files during setup
  get directory() { return `${this.table.directory}/${this.name}` }
  get controllerPath() { return `${this.directory}/${this.name}.controller` }

  // the adjacent routes from the same table
  get next() { return this.table.routes[this.index + 1] }
  get prev() { return this.table.routes[this.index - 1] }

  // helpers for the path of the next / previous route
  get nextPath() { return this.next && this.next.path }
  get prevPath() { return this.prev && this.prev.path }

  eachLocale(fn) {
    return this.table.locales.forEach(locale => fn(this.path[locale], locale))
  }

  // a URL for this route, given a query
  url(locale, query={}) {
    return url.format({
      pathname: this.path[locale],
      query: query,
    })
  }

  // set up this route's controller in an Express app
  config(app) {
    addViewPath(app, this.directory)
    require(this.controllerPath)(app, this)
    return this
  }

  render() {
    return (req, res) => {
      Object.assign(res.locals, req.session.errorState || {})
      res.render(this.name)
    }
  }

  /**
   * The default middleware for this route, intended
   * for the POST method.
   */
  defaultMiddleware(opts) {
    return [
      ...this.applySchema(opts.schema),
      this.doRedirect(opts.computeNext),
    ]
  }

  /**
   *
   * @param {object} schema Schema object from the route folder
   *
   * This grabs every key that we expect from the schema, it grabs the default value and passes it to Loadkeys to be loaded inside the locals of the views
   *
   */
  loadSchema(schema) {
    const defaults = {}
    const keys = Object.keys(schema)
    keys.forEach(k => { defaults[k] = schema[k].default })

    return this.loadKeys(keys, defaults)
  }

  /**
   *
   * @param {*} keys Are in the format of an array with the name of each key that you want added. This would be keys that are not already being added by loadSchema()
   * @param {*} defaults object in the format of keyname: 'defaultValue', 'surname': 'Boisvert' (if you wanted a default surname of Boisvert...)
   */
  loadKeys(keys, defaults = {}) {
    const has = (o, k) => o && Object.prototype.hasOwnProperty.call(o, k)

    return (req, res, next) => {
      // copy data from these sources in order, falling through
      // if each is not present.
      keys.forEach(k => {
        res.locals[k] = has(req.body, k) ? req.body[k]
                      : has(req.session, k) ? req.session[k]
                      : defaults[k]
      })

      // make all variables available on a global `data` field, to
      // enable dynamic lookup in views
      // res.locals.data = res.locals

      next()
    }
  }

  loadFullSession(defaults = {}) {
    return (req, res, next) => {
      this.loadKeys(Object.keys(req.session || {}), defaults)(req, res, next)
    }
  }

  applySchema(schema) {
    return [checkSchema(schema), saveToSession, checkErrors]
  }

  doRedirect(redirectTo = null) {
    return (req, res, next) => {
      if (req.body.json) return next()

      if (typeof redirectTo === 'function') redirectTo = redirectTo(req, res, this)
      if (!redirectTo) redirectTo = this.next
      if (typeof redirectTo === 'string') redirectTo = this.get(redirectTo)
      res.redirect(redirectTo.url(req.locale))
    }
  }
}

class DrawRoutes {
  constructor(route, app) {
    this.route = route
    this.app = app
  }

  request(method, ...args) {
    this.route.eachLocale((path, locale) => {
      this.app[method](path, routeMiddleware(this.route, locale), ...args)
    })

    return this
  }

  get(...args) { return this.request('get', ...args) }
  post(...args) { return this.request('post', ...args) }
  put(...args) { return this.request('put', ...args) }
  delete(...args) { return this.request('delete', ...args) }

  use(...args) {
    this.route.eachLocale((path, locale) => { this.app.use(path, ...args) })
    return this
  }
}

const oneHour = 1000 * 60 * 60 * 1
const routeMiddleware = (route, locale) => (req, res, next) => {
  res.cookie('lang', locale, {
    httpOnly: true,
    maxAge: oneHour,
    sameSite: 'strict',
  })

  res.setLocale(locale)

  res.locals.route = route
  res.locals.routePath = (nameOrObj) => {
    if (typeof nameOrObj === 'string') nameOrObj = route.get(nameOrObj)
    return nameOrObj.path[locale]
  }

  // override
  res.locals.jsPaths = () => wrapArray(getClientJs(req, route.name))

  return next()
}

/**
 * @returns a new routing table
 */
const makeRoutingTable = (routes, locales, opts={}) => new RoutingTable(routes, locales, opts)

/**
 * The default `configRoutes` function
 */
const configRoutes = (app, routes, locales, opts={}) => {
  // require the controllers defined in the routes
  // dir and file name based on the route name
  return makeRoutingTable(routes, locales, opts).config(app)
}

module.exports = {
  makeRoutingTable,
  configRoutes,
}
