const express = require('express')
const BagsServices = require('./bags-services')
const { requireAuth } = require('../middleware/jwt-auth')

const bagsRouter = express.Router()
const jsonBodyParser = express.json()

//Get all of the signed in user's bagged discs

bagsRouter
  .route('/')
  .all(requireAuth)
  .get((req, res, next) => {
    const user_id = req.user.id
    BagsServices.getUserDiscs(req.app.get('db'), user_id)
      .then(discs => {
        const serializedDiscs = discs.map(disc => 
          BagsServices.serializeBagDisc(disc))
        res.status(200).json(serializedDiscs)
      })
      .catch(next)
  })

//Add discs to users bag by providing disc_id and user_id

module.exports = bagsRouter