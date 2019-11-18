import helmet from 'helmet'
import nosniff from 'dont-sniff-mimetype'
import express from 'express'
import cors from 'cors'
import morgan from 'morgan'
import path from 'path'
import bodyParser from 'body-parser'
require('dotenv').config()

const app = express()

// Helmet options for production environment
if (process.env.NODE_ENV === 'production') {
  app.use(helmet())
  app.disable('x-powered-by')
  app.use(nosniff())
}

// Logging for request details
process.env.NODE_ENV === 'development'
  ? app.use(morgan('dev'))
  : app.use(morgan('combined'))

// Parser for request handlers
app.use(bodyParser.json())
app.use(
  bodyParser.urlencoded({
    extended: true,
  }),
)

// Enable CORS for all requests
app.use(cors())
app.options('*', cors())

// Handler for 404 - resources not found
app.use((req, res) => {
  res.status(404).send('we think you are lost')
})

// Handler for Error 500
app.use((err, req, res) => {
  console.error(err.stack)
  res.sendFile(path.join(__dirname, '../public/500.html'))
})

// Server port
const PORT = process.env.PORT || 4001

app.listen(PORT, () => console.info(`Server has started on ${PORT}`))
