/* istanbul ignore file */

const isValidRegAppNum = require('../../utils/').isValidRegAppNum
const isValidEmail = require('../../utils/').isValidEmail

const Schema = {
  applicationNumber: {
    custom: {
      options: (value, { req }) => {
        return isValidRegAppNum(value)
      },
      errorMessage: 'errors.application.error',
    },
  },
  email: {
    isLength: {
      errorMessage: 'errors.email.length',
      options: { min: 3, max: 200 },
    },
    custom: {
      options: (value, { req }) => {
        return isValidEmail(value)
      },
      errorMessage: 'errors.email.format',
    },
  },
  confirmEmail: {
    isLength: {
      errorMessage: 'errors.email.length',
      options: { min: 3, max: 200 },
    },
    custom: {
      options: (value, { req }) => {
        if (value === req.body.email) {
          return true
        }
      },
      errorMessage: 'errors.confirmEmail',
    },
  },

  accessible: {
    isIn: {
      errorMessage: 'errors.accessible.valid',
      options: [['Yes', 'No']],
    },
  },
}

module.exports = {
  Schema,
}
