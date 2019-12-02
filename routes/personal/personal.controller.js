const { Schema } = require('./schema.js')

module.exports = (app, route) => {
  route.draw(app)
    .use(route.loadSchema(Schema))
    .get(route.render())
    .post(route.applySchema(Schema), route.doRedirect())
}
