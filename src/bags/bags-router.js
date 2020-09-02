const express = require('express')
const path = require('path')
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
      if(value == null){ 
        return res.status(400).json({
          error: { message: `Missing ${key} in request body` }
        })
      }
      if(typeof value !== 'number'){
        return res.status(400).json({
          error: { message: 'Invalid disc_id' }
        })
      }
    }

    BagsServices.getById(req.app.get('db'), disc_id)
      .then(disc => {
        if(!disc){
          return res.status(400).json({
            error: { message: 'Disc does not exist' }
          })
        }
        newDisc.user_id = req.user.id

        return BagsServices.insertBagDisc(req.app.get('db'), newDisc)
          .then(disc =>{
            res
              .status(201)
              .location(path.posix.join(req.originalUrl, `/${disc.id}`))
              .json(BagsServices.serializeBagDisc(disc))
          })
      })
      .catch(next)
  })

module.exports = bagsRouter