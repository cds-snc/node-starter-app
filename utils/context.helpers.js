const lookupKeypath = (obj, keyPath) => {
  var out = obj
  keyPath.forEach(k => { out = out ? out[k] : undefined })
  return out
}

// convert an array of keys to a path as used in express-validator
const errorPath = (keys) => {
  const [first, ...rest] = keys

  const paths = rest.map(key => typeof key === 'number' ? `[${key}]` : `.${key}`)

  return first + paths.join('')
}

// we define our helper functions inside the middleware because
// we need them to access `res.local`.
const contextMiddleware = (req, res, next) => {
  // a request-global stack of key paths into res.locals.
  // these should always be called as a pair - similar to do...end.
  // we would ideally use a caller() macro for this, but those are...
  // unreliable at best.
  const keyPath = []
  res.locals.enterContext = (key) => { keyPath.push(key) }
  res.locals.exitContext = () => { keyPath.pop() }

  // look up a key at the current keypath
  res.locals.getData = (...keys) => lookupKeypath(res.locals, keyPath.concat(keys))
  res.locals.getError = (...keys) => (res.locals.errors || {})[errorPath(keyPath.concat(keys))]

  res.locals.pad = (arr=[], len=1) => {
    if (len < 1) len = 1
    if (arr.length >= len) return arr
    return arr.concat(new Array(len - arr.length).fill({}))
  }

  // The qualified name for a locally defined key, for use in a
  // name="..." attribute of a form control.
  //
  // If keyPath is empty, this will just return the same name.
  res.locals.getName = (...names) => {
    const [first, ...rest] = keyPath.concat(names)
    return first + rest.map(x => `[${x}]`).join('')
  }

  let isFirstOverall = true
  res.locals.isFirstError = (...keys) => {
    if (res.locals.firstError) {
      return errorPath(keyPath.concat(keys)) === res.locals.firstError
    }
    else if (isFirstOverall) {
      isFirstOverall = false
      return true
    }
    else {
      return false
    }
  }

  next()
}

module.exports = {
  contextMiddleware,
}
