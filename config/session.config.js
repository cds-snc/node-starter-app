/*
 configuration for our sessions
  - set a name for the session so that the session persists between server reloads
    - if a SESSION_SECRET environment variable, use that as a secret name
    - else use a timestamp that rotates every 60 minutes
  - also set session expiry time to 60 minutes
  more docs here: https://expressjs.com/en/resources/middleware/cookie-session.html
*/
const session = require('express-session')
const MemoryStore = require('memorystore')(session)
const cookieSession = require('cookie-session')

const oneHour = 1000 * 60 * 60
const sessionName = `ctb-${process.env.SESSION_SECRET ||
  Math.floor(new Date().getTime() / oneHour)}`
  
const cookieSessionConfig = {
  name: sessionName,
  secret: sessionName,
  cookie: {
    httpOnly: true,
    maxAge: oneHour,
    sameSite: true,
  },
}
const memorySessionConfig = {
  cookie: { httpOnly: true, maxAge: oneHour, sameSite: 'strict' },
  store: new MemoryStore({
    checkPeriod: oneHour, // prune expired entries every hour
  }),
  secret: sessionName,
  resave: false,
  saveUninitialized: false,
  unset: 'destroy',
}

const sessions = { 
  cookie : cookieSession(cookieSessionConfig),
  memory: session(memorySessionConfig),
}

// In production use redis but this works for now
const appSession = sessions.cookie
module.exports = appSession
