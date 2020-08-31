const AuthService = require('../auth/auth-services')

function requireAuth(req, res, next) {
  const authToken = req.get('authorization') || ''
  let bearerToken

  if(!authToken.toLowerCase().startsWith('bearer ')){
    return res.status(401).json({
      error: { message: 'Missing bearer token' }
    })
  } else {
    bearerToken = authToken.slice('bearer '.length, authToken.length)
  }

  try{
    AuthService.verifyJwt(bearerToken)
    next()
  } catch(error) {
    res.status(401).json({
      error: { message: 'Unauthorized request' }
    })
  }
}

module.exports = requireAuth