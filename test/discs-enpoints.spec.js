const knex = require('knex')

const helpers = require('./test-helpers')
const { makeTestFixtures } = require('./test-helpers')
const app = require('../src/app')
const supertest = require('supertest')

describe('Discs Endpoints', () => {

  let db
  const { testDiscs, testUsers } = makeTestFixtures()

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

  describe('GET /api/discs', () => {
    context('Given no data', () => {
      beforeEach('insert users', () => {
        helpers.seedUsers(db, testUsers)
      })
      it('responds 200 and empty array', () => {
        return supertest(app)
          .get('/api/discs')
          .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
          .expect(200, [])
      })
    })
    context('Given data in discs table', () => {
      beforeEach('insert test discs', () => {
        helpers.seedDiscs(db, testDiscs)
      })
      beforeEach('insert users', () => 
        helpers.seedUsers(db, testUsers))
        
      it('responds 200 with list of discs', () => {
        return supertest(app)
          .get('/api/discs')
          .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
          .expect(200, testDiscs)
      })
    })
  })
})