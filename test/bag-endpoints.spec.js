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

  describe('GET /api/bags', () => {
    context('given no data', () => {
      beforeEach('insert users', () => helpers.seedUsers(db, testUsers))

      it('responds 200 and empty list', () => {
        return supertest(app)
          .get('/api/bags')
          .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
          .expect(200, [])
      })
    })
    context('Given data', () => {
      beforeEach('Seed tables', () => {
        return helpers.seedBagDiscs(db, testDiscs, testUsers, testBagDiscs)
      })
      it('responds 200 and list of discs for valid user', () => {
        const validUser = testUser
        const expectedDiscs = helpers.makeExpectedUserBag(testBagDiscs, testDiscs, validUser.id)
        
        return supertest(app)
          .get('/api/bags')
          .set('Authorization', helpers.makeAuthHeader(validUser))
          .expect(200, expectedDiscs)
      })
    })
  })
  describe('POST /api/bags', () => {

  })
})