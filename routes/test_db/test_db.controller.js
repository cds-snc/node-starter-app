// const { routeUtils } = require('./../../utils')
// const dynamoose = require('dynamoose')

module.exports = (app, route) => {
  const name = route.name

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
