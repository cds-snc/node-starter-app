const routeHelpers = require('./route.helpers.js')
const sessionHelpers = require('./session.helpers.js')
const urlHelpers = require('./url.helpers.js')
const validateHelpers = require('./validate.helpers.js')
const viewHelpers = require('./view.helpers.js')
const flashMessageHelpers = require('./flash.message.helpers')
const loadHelpers = require('./load.helpers')
const contextHelpers = require('./context.helpers')
const schemaHelpers = require('./schema.helpers')

module.exports = {
  ...routeHelpers,
  ...viewHelpers,
  ...sessionHelpers,
  ...urlHelpers,
  ...validateHelpers,
  ...viewHelpers,
  ...flashMessageHelpers,
  ...loadHelpers,
  ...contextHelpers,
  ...schemaHelpers,
}

const { getRouteByName } = require('./route.helpers')
const { addViewPath } = require('./view.helpers')
const { getDefaultMiddleware } = require('./route.helpers')

module.exports.routeUtils = {
  getRouteByName,
  addViewPath,
  getDefaultMiddleware,
}
