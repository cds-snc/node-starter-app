const getSessionData = req => {
  if (!req.session) return {}
  return typeof req.session.formdata === 'object' ? req.session.formdata : {}
}

const saveSessionData = req => {
  // copy all posted parameters
  const body = Object.assign({}, req.body)
  delete body.redirect
  delete body._csrf

  req.session.formdata = { ...req.session.formdata, ...body }
}

module.exports = {
  getSessionData,
  saveSessionData,
}
