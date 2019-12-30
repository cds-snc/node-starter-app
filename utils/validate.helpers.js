const { validationResult } = require('express-validator')

/*
  original format is an array of error objects: https://express-validator.github.io/docs/validation-result-api.html
  convert that to an object where the key is the parameter name and value is the error object
  ie,
  [
    { param: 'name', msg: 'Cannot be empty', ... },
    { param: 'number', msg: 'Cannot be empty', ... }
  ]
  to
  {
    name: { param: 'name', msg: 'Cannot be empty', ... },
    number: { param: 'number', msg: 'Cannot be empty', ... }
  }
*/
const errorArray2ErrorObject = (errors = []) => {
  return errors.array({ onlyFirstError: true }).reduce((map, obj) => {
    map[obj.param] = obj
    return map
  }, {})
}

const isValidDate = dateString => {
  const regEx = /^\d{4}-\d{2}$/ // YYYY-MM
  if (!dateString.match(regEx)) {
    return false // Invalid format
  }

  var d = new Date(`${dateString}-01`)
  var dNum = d.getTime()

  if (!dNum && dNum !== 0) return false // NaN value, Invalid date
  return d.toISOString().slice(0, 7) === dateString
}

/**
 * Middleware function that runs our error validation
 *
 * Since returning our errors is looking like a lot of boilerplate code, this function:
 *
 * - checks if the request parameters match the schema
 * - checks if there are errors
 * - if no errors, "next()"
 * - if there are errors,
 *   - send back a 422 status
 *   - add the session data to the template
 *   - put the request parameters into the template (except for the redirect)
 *   - render the passed-in template string
 *
 * By including this function, we can cut down our post functions by about half
 *
 * @param string template The template string to render if errors are found (should match the one used for the GET request)
 */
const checkErrors = (req, res, next) => {
  // check to see if the requests should respond with JSON
  if (req.body.json) {
    return checkErrorsJSON(req, res, next)
  }

  const errors = validationResult(req)

  if (!errors.isEmpty()) {
    req.session.errorState = {
      errors: errorArray2ErrorObject(errors),
      firstError: errors.errors[0].param,
    }

    return res.redirect('back')
  }

  req.session.errorState = null
  return next()
}

const checkErrorsJSON = (req, res, next) => {
  const errors = validationResult(req)

  if (!errors.isEmpty()) {
    return res.json(errorArray2ErrorObject(errors))
  }

  return res.json({})
}

/* Pug filters */

/**
 * @param {Object} obj the obj we're passing, most often 'data'
 * @param {String} key the key we're trying to access, passed as a string, not including the obj ref itself
 * ex. if we're trying to get to data.personal.maritalStatus
 * pass as hasData(data, 'personal.maritalStatus')
 */
const hasData = (obj = {}, key = '') => {
  return key.split('.').every(x => {
    if (
      typeof obj !== 'object' ||
      obj === null ||
      !obj.hasOwnProperty(x) || // eslint-disable-line no-prototype-builtins
      obj[x] === null ||
      obj[x] === ''
    ) {
      return false
    }
    obj = obj[x]
    return true
  })
}

const isEmptyObject = obj => {
  return Object.entries(obj).length === 0 && obj.constructor === Object
}

module.exports = {
  errorArray2ErrorObject,
  isValidDate,
  checkErrors,
  checkErrorsJSON,
  hasData,
  isEmptyObject,
}
