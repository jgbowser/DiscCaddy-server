const knex = require('knex')

const app = require('../src/app')
const helpers = require('./test-helpers')
const supertest = require('supertest')

describe.only('Users endpoints', () => {

  let db

  const { testUsers } = helpers.makeTestFixtures()

  before('create knex instance', () => {
    db = knex({
      client: 'pg',
      connection: process.env.TEST_DB_URL
    })
    app.set('db', db)
  })

  before('cleanup', () => helpers.cleanTables(db))

  after('destroy connection', () => db.destroy())

  afterEach('cleanup', () => helpers.cleanTables(db))

  describe('POST /api/users', () => {
    context('User Validation', () => {
      beforeEach('insert users', () => {
        helpers.seedUsers(db, testUsers)
      })

      const requiredFields = ['first_name', 'last_name', 'username', 'email', 'password']

      requiredFields.forEach(field => {
        const registerAttemptBody = {
          first_name: 'john',
          last_name: 'doe',
          username: 'discman',
          email: 'john.doe@email.com',
          password: 'password'
        }
        it(`responds 400 required error when ${field} is missing`, () => {
          delete registerAttemptBody[field]

          return supertest(app)
            .post('/api/users')
            .send(registerAttemptBody)
            .expect(400, {
              error: { message: `Missing '${field}' in request body` }
            })
        })
      })
    })
  })
})
