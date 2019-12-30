const { matchedData } = require('express-validator')

const saveToSession = (req, res, next) => {
  // matchedData() comes from express-validator, which
  // only includes things mentioned in the schema.
  Object.assign(req.session, matchedData(req))
  next()
}

module.exports = {
  saveToSession,
}
