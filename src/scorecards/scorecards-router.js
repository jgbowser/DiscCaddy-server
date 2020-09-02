const express = require('express')
const ScorecardsService = require('./scorecards-service')
const { requireAuth } = require('../middleware/jwt-auth')

const scorecardsRouter = express.Router()
const jsonBodyParser = express.json()

scorecardsRouter
  .route('/')
  .all(requireAuth)