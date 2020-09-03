const express = require('express')
const AuthService = require('./auth-services')

const authRouter = express.Router()
const jsonBodyParser = express.json()

authRouter
  .route('/login')
  .post(jsonBodyParser, (req, res, next) => {
    const { username, password } = req.body
    const userLogin = { username, password }

    for(const [key, value] of Object.entries(userLogin)){
      if(!value) {
        return res.status(400).json({
          error: { message: `Missing '${key}' in request body` }
        })
      }
    }
    
    AuthService.getUserWithUserName(req.app.get('db'), userLogin.username)
      .then(dbUser => {
        if(!dbUser){
          return res.status(400).json({
            error: { message: 'Invalid username or password' }
          })
        }
        return AuthService.comparePasswords(userLogin.password, dbUser.password)
          .then(compareMatch => {
            if(!compareMatch) {
              return res.status(400).json({
                error: { message: 'Invalid username or password' }
              })
            }
            const sub = dbUser.username
            const payload = { user_id: dbUser.id }
            res.send({
              authToken: AuthService.createJwt(sub, payload)
            })
          })
      })
      .catch(next)
  })

module.exports = authRouter