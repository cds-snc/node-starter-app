const spreadParams = env => {
  env.addFilter('spreadParams', (str, params) => {
    let paramsStr = ''

    for (let property in params) {
      paramsStr += ` ${property}=${params[property]} `
    }

    return `${paramsStr}`
  })
}

module.exports = {
  spreadParams,
}
