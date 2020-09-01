const knex = require('knex')
const app = require('../src/app')
const helpers = require('./test-helpers')
const supertest = require('supertest')

describe.only('Bags Endpoints', () => {
  let db

  const { testUsers, testDiscs, testBagDiscs } = helpers.makeTestFixtures()
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

  describe('GET /api/bags/:user_id', () => {
    context('given no data', () => {

      it('should respond 200 and empty list', () => {
        return supertest(app)
          .get(`/api/bags/${testUser.id}`)
          .expect(200, [])
      })
    })
    context('Given data', () => {
      beforeEach('Seed tables', () => {
        helpers.seedBagDiscs(db, testDiscs, testUsers, testBagDiscs)
      })
      it('should respond 404 given an invalid user_id', () => {
        const invalidId = 123

        return supertest(app)
          .get(`/api/bags/${invalidId}`)
          .expect(404, {
            error: { message: 'User does not exist' }
          })
      })
    })
  })
})