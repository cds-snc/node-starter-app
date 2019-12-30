const { spreadParams } = require('./spread.params')
const { errorHelpers } = require('./error.helpers')

const addNunjucksFilters = env => {
  spreadParams(env)
  errorHelpers(env)
}

module.exports = {
  addNunjucksFilters,
}
