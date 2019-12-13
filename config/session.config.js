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
const FileStore = require('session-file-store')(session)

const oneHour = 1000 * 60 * 60
const sessionName = `ctb-${process.env.SESSION_SECRET ||
  Math.floor(new Date().getTime() / oneHour)}`
 

// In production use redis but this works for now
const store = { 
  memory: () => new MemoryStore({ checkPeriod: oneHour }),
  fileStore: () => new FileStore({}),
}

const sessionConfig= {
  cookie: { httpOnly: true, maxAge: oneHour, sameSite: 'strict' },
  store: store.fileStore(),
  secret: sessionName,
  resave: false,
  saveUninitialized: false,
  unset: 'destroy',
}


module.exports =  session(sessionConfig)
