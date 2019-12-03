const { getJSFile } = require('../utils/load.helpers')

const jsFile = env => {
  env.addFilter('jsFile', (str, params) => {
    const file = getJSFile(params)
    return file
  })
}

module.exports = {
  jsFile,
}
