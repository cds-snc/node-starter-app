const errorHelpers = env => {
  env.addFilter('errorToName', (str) => {
    return str.replace(/[.](\w+)/g, '[$1]')
  })
}

module.exports = {
  errorHelpers
}
