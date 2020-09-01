const express = require('express')
const BagsServices = require('./bags-services')

const bagsRouter = express.Router()
const jsonBodyParser = express.json()

bagsRouter
  .route('/:user_id')
  .get((req, res, next) => {
    const user_id = req.params.user_id
    
    const user = BagsServices.checkUserExists(req.app.get('db'), user_id)
    
    if(!user){
      return res.status(404).json({
        error: { message: 'User does not exist '}
      })
    }

    BagsServices.getUserDiscs(req.app.get('db'), user_id)
      .then(discs => {
        res.status(200).json(discs)
      })
      .catch(next)
  })

module.exports = bagsRouter