const spreadParams = env => {
  env.addFilter('spreadParams', function(str, params) {
    let paramsStr = ''

    for (var property in params) {
      if (params.hasOwnProperty(property)) {
        paramsStr += ` ${property}=${params[property]} `
      }
    }

    return `${paramsStr}`
  })
}

module.exports = {
  spreadParams,
}
