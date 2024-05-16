require('dotenv').config()
require('express-async-errors')

const path = require('path')

// extra security packages

const helmet = require('helmet')
const xss = require('xss-clean')

const express = require('express')
const app = express()

// connectDB
const connectDB = require('./db/connect')
const fileUpload = require('express-fileupload')

// routers
const authRoutes = require('./routes/auth')
const jobsRoutes = require('./routes/job')
const authenticationMiddleware = require('./middleware/authentication')

// error handlers
const notFoundMiddleware = require('./middleware/not-found')
const errorHandlerMiddleware = require('./middleware/error-handler')

app.set('trust proxy', 1)

app.use(express.static(path.resolve(__dirname, './client/dist')))
app.use(express.static('./image'))
app.use(express.json())
app.use(fileUpload())
app.use(helmet())
app.use(xss())

// routes
app.use('/api/v1/auth', authRoutes)
app.use('/api/v1/jobs', authenticationMiddleware, jobsRoutes)

app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, './client/dist', 'index.html'))
})

app.use(notFoundMiddleware)
app.use(errorHandlerMiddleware)

const port = process.env.PORT || 5000

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI)
    app.listen(port, () => {
      console.log(`Server is listening on port ${port}...`)
    })
  } catch (error) {
    console.log(error)
  }
}

start()
