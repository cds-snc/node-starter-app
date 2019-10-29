/* istanbul ignore file */

const Schema = {
  policy: {
    isLength: {
      errorMessage: 'error.policy',
      options: { min: 3, max: 200 },
    },
  },
}

module.exports = {
  Schema,
}
