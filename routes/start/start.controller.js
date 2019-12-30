module.exports = (app, route) => {
  // redirect from "/" → "/start"
  app.get('/', (req, res) => res.redirect(route.path[req.locale]))

  route.draw(app).get(route.render())
}
