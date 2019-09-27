const { spreadParams } = require('./spread.params')

const addNunjucksFilters = env => {
  spreadParams(env)
}

module.exports = {
  addNunjucksFilters,
}
