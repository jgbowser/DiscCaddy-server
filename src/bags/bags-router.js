const express = require('express')
const BagsServices = require('./bags-services')
const { requireAuth } = require('../middleware/jwt-auth')

const bagsRouter = express.Router()
const jsonBodyParser = express.json()

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
  .post(jsonBodyParser, (req, res, next) => {
    const { disc_id } = req.body
    const newDisc = { disc_id }
    
    for(const [key, value] of Object.entries(newDisc)) {
      if(value == null) 
        return res.status(400).json({
          error: { message: `Missing ${key} in request body` }
        })
      if(typeof value !== 'number')
        return res.status(400).json({
          error: { message: 'Invalid disc_id' }
        })
    }

    newDisc.user_id = req.user.id
    
    res.send('ok')
  })

//Add discs to users bag by providing disc_id and user_id

module.exports = bagsRouter