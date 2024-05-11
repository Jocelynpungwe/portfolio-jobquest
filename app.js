require('dotenv').config()
require('express-async-errors')

const express = require('express')
const app = express()

const path = require('path')

// connectDB
const connectDB = require('./db/connect')
const fileUpload = require('express-fileupload')
// routers
const authRoutes = require('./routes/auth')

// error handlers
const notFoundMiddleware = require('./middleware/not-found')
const errorHandlerMiddleware = require('./middleware/error-handler')

app.use(express.static('./image'))
app.use(express.json())
app.use(fileUpload())

// routes
app.use('/api/v1/auth', authRoutes)

app.use(notFoundMiddleware)
app.use(errorHandlerMiddleware)

const port = process.env.PORT || 5000

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI)
    app.listen(port, () => {
      console.log(`Server listing in port ${port}...`)
    })
  } catch (error) {
    console.log(error)
  }
}

start()
