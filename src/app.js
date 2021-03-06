require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const helmet = require('helmet')

const { NODE_ENV } = require('./config')
const authRouter = require('./auth/auth-router')
const usersRouter = require('./users/users-router')
const discsRouter = require('./discs/discs-router')
const bagsRouter = require('./bags/bags-router')
const scorecardsRouter = require('./scorecards/scorecards-router')

const app = express()

const morganOption = (NODE_ENV === 'production')
  ? 'tiny'
  : 'dev';


// Middleware //

app.use(morgan(morganOption))
app.use(helmet())
app.use(cors())

// Routers //

app.use('/api/auth', authRouter)
app.use('/api/users', usersRouter)
app.use('/api/discs', discsRouter)
app.use('/api/bags', bagsRouter)
app.use('/api/scorecards', scorecardsRouter)


// Error handling //

// eslint-disable-next-line no-unused-vars
app.use(function errorHandler(error, req, res, next) {
  let response
  if(NODE_ENV === 'production') {
    response = { error: {message: 'server error'}}
  } else {
    // eslint-disable-next-line no-console
    console.error(error)
    response = { message: error.message, error }
  }
  res.status(500).json(response)
})

module.exports = app