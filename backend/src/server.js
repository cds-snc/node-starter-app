import express from 'express'
import bodyParser from 'body-parser'
import helmet from 'helmet'
import nosniff from 'dont-sniff-mimetype'
import cors from 'cors'
import morgan from 'morgan'

require('dotenv').config()

const app = express()
const port = 3000

if (process.env.NODE_ENV === 'production') {
  app.use(helmet())
  app.disable('x-powered-by')
  app.use(nosniff())
}

app.use(bodyParser.json())
app.use(
  bodyParser.urlencoded({
    extended: true,
  }),
)

console.log(process.env.ENV_TEST)
