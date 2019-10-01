const path = require('path')
const { routeUtils } = require('./../../utils')
// const dynamoose = require('dynamoose')

module.exports = app => {
  const name = 'test_db'
  const route = routeUtils.getRouteByName(name)

  routeUtils.addViewPath(app, path.join(__dirname, './'))
  /*
  dynamoose.AWS.config.update({})

  const Submissions = dynamoose.model('Submissions', {
    fullname: String,
  })

  const entry = new Submissions({
    fullname: 'Mr. Test',
  })

  entry.save()
  */

  app.get(route.path, (req, res) => {
    res.render(name)
  })
}
