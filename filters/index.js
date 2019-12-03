const { spreadParams } = require('./spread.params')
const { jsFile } = require('./js.file')

const addNunjucksFilters = env => {
  spreadParams(env)
  jsFile(env)
}

module.exports = {
  addNunjucksFilters,
}
