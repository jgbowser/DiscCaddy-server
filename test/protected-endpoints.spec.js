const knex = require('knex')

const app = require('../src/app')
const helpers = require('./test-helpers')
const supertest = require('supertest')

describe('Protected Endpoints', () => {
  let db

  const { testUsers, testDiscs, testBagDiscs } = helpers.makeTestFixtures()

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

  beforeEach('insert data', () => helpers.seedBagDiscs(db, testDiscs, testUsers, testBagDiscs))

  const protectedEndpoints = [
    {
      name: 'GET /api/discs',
      path: '/api/discs',
      method: supertest(app).get
    },
    {
      name: 'GET /api/bags',
      path: '/api/bags',
      method: supertest(app).get
    },
    {
      name: 'POST /api/bags',
      path: '/api/bags',
      method: supertest(app).post
    }
  ]

  protectedEndpoints.forEach(endpoint => {
    describe(endpoint.name, () => {
      it('responds 401 "Missing bearer token" when no bearer token', () => {
        return endpoint.method(endpoint.path)
          .expect(401, {
            error: { message: 'Missing bearer token' }
          })
      })
      it('responds 401 "Unauthorized request" when invalid JWT secret', () => {
        const validUser = testUsers[0]
        const invalidSecret = 'bad-secret'
        return endpoint.method(endpoint.path)
          .set('Authorization', helpers.makeAuthHeader(validUser, invalidSecret))
          .expect(401, {
            error: { message: 'Unauthorized request' }
          })
      })
      it('responds 401 "Unauthorized request" when invalid sub in payload', () => {
        const invalidUser = {username: 'not-existy', id: 1}
        return endpoint.method(endpoint.path)
          .set('Authorization', helpers.makeAuthHeader(invalidUser))
          .expect(401, {
            error: { message: 'Unauthorized request' }
          })
      })
    })
  })
})