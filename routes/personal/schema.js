/* istanbul ignore file */

const isValidDate = require('../../utils/').isValidDate

const Schema = {
  fullname: {
    isLength: {
      errorMessage: 'errors.fullname.length',
      options: { min: 3, max: 200 },
    },
  },
  email: {
    isLength: {
      errorMessage: 'errors.email.length',
      options: { min: 3, max: 200 },
    },
  },
  expiry: {
    customSanitizer: {
      options: value => {
        // We want to remove any spaces, dash or underscores
        return value ? value.replace(/[_]*/g, '') : value
      },
      errorMessage: 'errors.expiry.date.format',
    },
    custom: {
      options: (value, { req }) => {
        return isValidDate(value)
      },
      errorMessage: 'errors.expiry.date',
    },
  },
  send_notifications: {
    isIn: {
      errorMessage: 'errors.send_notifications.valid',
      options: [['Yes', 'No']],
    },
  },
  notify_type: {
    custom: {
      options: (value, { req }) => {
        const sendNotifications = req.body.send_notifications
        if (sendNotifications && sendNotifications === 'Yes') {
          if (typeof value === 'undefined') {
            return false
          }
        } else {
          req.body.notify_type = undefined
        }

        return true
      },
      errorMessage: 'errors.notify_type',
    },
  },

  address: {
    isLength: {
      errorMessage: 'errors.address.length',
      options: { min: 5, max: 500 },
    },
  },
}

module.exports = {
  Schema,
}
