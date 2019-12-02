const { repeatSchema } = require('./../../utils')

const Schema = {
  ...repeatSchema('addresses', {
    street: {
      isLength: {
        errorMessage: 'errors.addresses.street.length',
        options: { min: 10, max: 200 },
      },
    },
  }),
}

module.exports = {
  Schema,
}
