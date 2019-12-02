const mockSession = () => {
  jest.mock('cookie-session')
  const cookieSession = require('cookie-session')
  let sessionOverride = {}

  cookieSession.mockReturnValue((req, res, next) => {
    req.session = sessionOverride
    next()
  })

  return (session) => { sessionOverride = session }
}

module.exports = {
  mockSession,
}
