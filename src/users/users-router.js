const express = require('express')
const { json } = require('express')

const usersRouter = express.Router()
const jsonBodyParser = express.json()

usersRouter
  .route('/')
  .post(jsonBodyParser, (req, res, next) => {
    for(const field of ['first_name', 'last_name', 'username', 'email', 'password']){
      if(!req.body[field]){
        return res.status(400).json({
          error: { message: `Missing '${field}' in request body`}
        })
      }
    }
    res.send('ok')
  })

module.exports = usersRouter