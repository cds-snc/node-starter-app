const path = require('path')
const {
  // validateRouteData,
  getRouteByName,
  addViewPath,
  getViewData,
  // setFlashMessageContent,
} = require('../../utils/index')

module.exports = app => {
  const name = 'confirmation'
  const route = getRouteByName(name)

  addViewPath(app, path.join(__dirname, './'))

  app.get(route.path, async (req, res) => {
    // ⚠️ experimental
    // validate data from previous step
    // see if we should be allowed to reach this step

    /*
    const result = await validateRouteData(req, 'personal')
    if (!result.status) {
      setFlashMessageContent(req, result.errors)
      return res.redirect(getRouteByName('personal').path)
    }
    */

    res.render(name, getViewData(req))
  })
}
