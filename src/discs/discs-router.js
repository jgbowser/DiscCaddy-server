const express = require('express')

const DiscsService = require('./discs-service')
const { requireAuth } = require('../middleware/jwt-auth')


const discsRouter = express.Router()

discsRouter
  .route('/')
  .all(requireAuth)
  .get((req, res, next) => {
    DiscsService.getAllDiscs(req.app.get('db'))
      .then(discs => {
        const serializeDiscs = discs.map(disc => 
          DiscsService.serializeDisc(disc))
        res.status(200).json(serializeDiscs)
      })
      .catch(next)
  })

module.exports = discsRouter