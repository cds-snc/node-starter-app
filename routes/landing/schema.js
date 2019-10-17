const Schema = {
  fullname: {
    isLength: {
      errorMessage: 'errors.fullname.length',
      options: { min: 3, max: 200 },
    },
  },
}

module.exports = {
  Schema,
}
