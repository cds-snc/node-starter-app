const { spreadParams } = require('./spreadParams')

const addNunjucksFilters = env => {
  spreadParams(env)
}

module.exports = {
  addNunjucksFilters,
}
