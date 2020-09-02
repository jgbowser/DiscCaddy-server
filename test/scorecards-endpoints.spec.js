const knex = require('knex')
const app = require('../src/app')
const helpers = require('./test-helpers')
const supertest = require('supertest')

describe.only('Scorecards Endpoints', () => {
  let db

  const{ testUsers, testScorecards } = helpers.makeTestFixtures()
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

  describe('GET /api/scorecards', () => {
    context('Given no data', () => {
      beforeEach('seed users', () => helpers.seedUsers(db, testUsers))

      it('responds 200 and empty array', () => {
        return supertest(app)
          .get('/api/scorecards')
          .set('Authorization', helpers.makeAuthHeader(testUser))
          .expect(200, [])
      })
    })
  })
})