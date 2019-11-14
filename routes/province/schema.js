const Schema = {
  provinces: {
    isEmpty: {
      errorMessage: 'errors.province.notempty',
      options: { ignore_whitespace:false },
    },
  },
}

module.exports = {
  Schema,
}
