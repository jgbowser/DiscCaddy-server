const express = require('express')
const path = require('path')
const BagsService = require('./bags-services')
const { requireAuth } = require('../middleware/jwt-auth')

const bagsRouter = express.Router()
const jsonBodyParser = express.json()

bagsRouter
  .route('/')
  .all(requireAuth)
  .get((req, res, next) => {
    const user_id = req.user.id
    BagsService.getUserDiscs(req.app.get('db'), user_id)
      .then(discs => {
        const serializedDiscs = discs.map(disc => 
          BagsService.serializeBagDisc(disc))
        res.status(200).json(serializedDiscs)
      })
      .catch(next)
  })
  .post(jsonBodyParser, (req, res, next) => {
    const { disc_id } = req.body
    const newDisc = { disc_id }
    
    for(const [key, value] of Object.entries(newDisc)) {
      // eslint-disable-next-line eqeqeq
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

    BagsService.getById(req.app.get('db'), disc_id)
      .then(disc => {
        if(!disc){
          return res.status(400).json({
            error: { message: 'Disc does not exist' }
          })
        }
        newDisc.user_id = req.user.id

        return BagsService.insertBagDisc(req.app.get('db'), newDisc)
          .then(disc =>{
            res
              .status(201)
              .location(path.posix.join(req.originalUrl, `/${disc.id}`))
              .json(BagsService.serializeBagDisc(disc))
          })
      })
      .catch(next)
  })

module.exports = bagsRouter