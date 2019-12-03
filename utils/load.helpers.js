/* istanbul ignore file */
// note: there's test to look for a false response
// but coverage isn't catching

const path = require('path')
const { clientJsDir, getClientJsPath } = require('./url.helpers')

const getJSFile = (fileName, jsPath = '../public') => {
  try {
    const fs = require('fs')
    const fileList = path.join(
      __dirname,
      `${jsPath}${clientJsDir}_filelist.json`,
    )
    const content = fs.readFileSync(fileList)

    const json = JSON.parse(content)
    // get the JS filename from the list
    // _filelist.json
    /*
    {
      "start":"start.9dfca2e687c206cf5967.js",
      ...
    }
    */
    const file = json[fileName]
    const filePath = path.join(__dirname, `${jsPath}${clientJsDir}${file}`)
    const fileExists = fs.readFileSync(filePath)

    if (fileExists) {
      return file
    }

    return false
  } catch (e) {
    console.log(`${fileName}.js or filelist.json doesn't exist`)
    return false
  }
}

const getClientJs = (req, routeName = '', jsPath = '../public') => {
  const file = getJSFile(routeName)
  if (file) {
    return `${getClientJsPath(req)}${file}`
  }

  return false
}

module.exports = {
  getJSFile,
  getClientJs,
}
