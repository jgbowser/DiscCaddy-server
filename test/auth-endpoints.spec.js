const knex = require('knex')
const jwt = require('jsonwebtoken')

const app = require('../src/app')
const helpers = require('./test-helpers')
const supertest = require('supertest')

describe('Auth endpoints', () => {

  let db

  const { testUsers } = helpers.makeTestFixtures()
  const testUser = testUsers[0]

  before('make knex instance', () => {
    db = knex({
      client: 'pg',
      connection: process.env.TEST_DB_URL
    })
    app.set('db', db)
  })

  before('cleanup', () => helpers.cleanTables(db))

  after('destroy connection', () => db.destroy())

  afterEach('cleanup', () => helpers.cleanTables(db))

  describe('POST /api/auth/login', () => {
    beforeEach('insert users', () => 
      helpers.seedUsers(db, testUsers)
    )

    const requiredFields = ['username', 'password']

    requiredFields.forEach(field => {
      const loginAttemptBody = {
        username: testUser.username,
        password: testUser.password
      }

      it(`responds 400 required error when '${field}' is missing`, () => {
        delete loginAttemptBody[field]

        return supertest(app)
          .post('/api/auth/login')
          .send(loginAttemptBody)
          .expect(400, {
            error: { message: `Missing '${field}' in request body` }
          })
      })
    })
    it('responds 400 "Invalid username or password" when username is invalid', () => {
      const invalidUserName = { username: 'invalid', password: 'doesnt-matter' }

      return supertest(app)
        .post('/api/auth/login')
        .send(invalidUserName)
        .expect(400, {
          error: { message: 'Invalid username or password' }
        })
    })
    it('responds 400 "Invalid username or password" when password is invalid', () => {
      const invalidPasswordUser = { username: testUser.username, password: 'wrong' }

      return supertest(app)
        .post('/api/auth/login')
        .send(invalidPasswordUser)
        .expect(400, {
          error: { message: 'Invalid username or password' }
        })
    })
    it('responds 200 and JWT auth token when valid credentials', () => {
      const validUserCreds = {
        username: testUser.username,
        password: testUser.password
      }
      const expectedToken = jwt.sign(
        {user_id: testUser.id},
        process.env.JWT_SECRET,
        {
          subject: testUser.username,
          algorithm: 'HS256'
        }
      )
      return supertest(app)
        .post('/api/auth/login')
        .send(validUserCreds)
        .expect(200, {
          authToken: expectedToken
        })
    })
  })
})
