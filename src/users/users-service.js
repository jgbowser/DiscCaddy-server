const xss = require('xss')
const bcrypt = require('bcryptjs')

const REGEX_UPPER_LOWER_NUMBER_SPECIAL = /(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&])[\S]+/

const UsersService = {
  validatePasswords(password) {
    if(password.length < 8 ) {
      return {
        error: { message: 'Password must be longer than 8 characters' }
      }
    }
    if(password.length > 72) {
      return {
        error: { message: 'Password must be less than 72 characters' }
      }
    }
    if(password.startsWith(' ') || password.endsWith(' ')){
      return {
        error: { message: 'Password must not start or end with empty space' }
      }
    }
    if(!REGEX_UPPER_LOWER_NUMBER_SPECIAL.test(password)) {
      return {
        error: { message: 'Password must contain 1 upper case, lower case, number and special character' }
      }
    }
  },
  
  hasUserWithUserName(db, username) {
    return db('users')
      .where('username', username)
      .first()
      .then(user => !!user)
  },
  
  insertUser(db, newUser) {
    return db('users')
      .insert(newUser)
      .returning('*')
      .then(([user]) => user)
  },
  
  serializeUser(user) {
    return {
      id: user.id,
      first_name: xss(user.first_name),
      last_name: xss(user.last_name),
      username: xss(user.username),
      email: xss(user.email),
      date_created: new Date(user.date_created)
    }
  },

  hashPassword(password) {
    return bcrypt.hash(password, 12)
  }
}

module.exports = UsersService