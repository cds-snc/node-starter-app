module.exports = (app, route) => {
  route.draw(app)
    .get(route.loadFullSession(), route.render())
}
